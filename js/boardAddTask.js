//const BASE_URL = 'https://join-323f5-default-rtdb.europe-west1.firebasedatabase.app/';


let contactColors = {};
let categoryChoosedIndex = 'false';
let categoryChoosed = '';
let subcategoriesChoosed = [];
let choosedContacts = [];
let taskPrio = '';
let task = {};

async function addTaskInit() {
    await loadDataContacts();
    renderAssignedToContacts();
    showAvailableContacts();
    showCategoryList();
}

function renderAssignedToContacts() {
    let content = document.getElementById('at-contact-container');
    for (let i = 0; i < contacts.length; i++) {
        const contactName = contacts[i].name;
        let initials = getInitials(contactName);
        content.innerHTML += generateAssignedContactsHTML(initials, contactName, i)
        let color = setBackgroundColorInitials(initials);
        document.getElementById(`at-shortcut${i}`).style.backgroundColor = color;
    }
}

function generateAssignedContactsHTML(initials, contactName, i) {
    return /*html*/`
    <div onclick="addContactToTask('${initials}', ${i})">
        <div class="at-contact-layout">
            <div class="at-contact-name-container">
                <div id="at-shortcut${i}" class="at-contact-shortcut-layout">
                    <div class="at-contact-shortcut">${initials}</div>
                </div>
            <div class="at-contact-name">${contactName}</div>
        </div>
        <label class="at-label-checkbox">
            <input type="checkbox">
            <span class="at-checkmark"></span>
        </label>
        </div>
        </div>`
}

function addContactToTask(initials, i) {
    let index = choosedContacts.findIndex(contact => contact.id === i);
    if (index === -1) {
        choosedContacts.push({
            id: i,
            initial: initials,
        });
    } else {
        choosedContacts.splice(index, 1);
    }
    showChoosedContacts(initials);
}

function showChoosedContacts(initials) {
    let content = document.getElementById('at-selected-contacts');
    content.innerHTML = '';
    for (let i = 0; i < choosedContacts.length; i++) {
        let contact = choosedContacts[i].initial;
        let color = setBackgroundColorInitials(contact);
        content.innerHTML += `<div class="at-choosed-contact-shortcut" id="at-choosed-shortcut${i}"><div class="at-contact-shortcut">${contact}</div></div>`;
        let backgroundColor = document.getElementById(`at-choosed-shortcut${i}`);
        backgroundColor.style.backgroundColor = color;

    }
}

function getInitials(contact) {
    let names = contact.trim().split(' ');
    initials = names[0].substring(0, 1).toUpperCase();
    if (names.length > 1) {
        initials += names[names.length - 1].substring(0, 1).toUpperCase();
    }
    return initials;
};

function setBackgroundColorInitials(initials) {
    if (!contactColors[initials]) {
        let randomColor = Math.floor(Math.random() * 16777215).toString(16);
        contactColors[initials] = "#" + randomColor;
    }
    return contactColors[initials];
}

function showAvailableContacts() {
    let customSelects = document.querySelectorAll('.custom-select');
    customSelects.forEach(function (select) {
        let selectSelected = select.querySelector('.select-selected');
        let selectItems = select.querySelector('.select-items');
        let options = selectItems.querySelectorAll('.at-contact-layout');
        selectItems.style.display = 'none';
        showContactList(customSelects, selectSelected, selectItems)
        chooseContactFromList(options);

        window.addEventListener('click', function (event) {
            if (!select.contains(event.target)) {
                selectItems.style.display = 'none';
                document.getElementById('open-contact-list').classList.remove('d-none');
                document.getElementById('close-contact-list').classList.add('d-none');
            }
        });
    });
}

function showContactList(customSelects, selectSelected, selectItems) {
    selectSelected.addEventListener('click', function (event) {
        event.stopPropagation();
        customSelects.forEach(function (s) {
            s.querySelector('.select-items').style.display = 'none';
        });
        selectItems.style.display = selectItems.style.display === 'block' ? 'none' : 'block';
        if (selectItems.style.display === 'none') {
            document.getElementById('open-contact-list').classList.remove('d-none');
            document.getElementById('close-contact-list').classList.add('d-none');
        } else {
            document.getElementById('open-contact-list').classList.add('d-none');
            document.getElementById('close-contact-list').classList.remove('d-none');
        }
    });
}

function chooseContactFromList(options) {
    options.forEach(function (option) {
        option.addEventListener('click', function (event) {
            let checkbox = option.querySelector('input[type="checkbox"]');
            checkbox.checked = !checkbox.checked;
        });
    });
}

function setBackgroundColorPrio(prio) {
    let prioStatus = document.getElementById(prio);
    let prioImgDeactive = document.getElementById(`${prio}-img-deactive`);
    let prioImgActive = document.getElementById(`${prio}-img-active`);
    resetOtherPriorities(prio);

    if (prioStatus.classList.contains(`at-bg-${prio}`)) {
        removeBackgroundColor(prio, prioStatus, prioImgDeactive, prioImgActive);
        taskPrio = '';
        console.log(taskPrio);
    } else {
        addBackgroundColor(prio, prioStatus, prioImgDeactive, prioImgActive);
        taskPrio = prio;
        console.log(taskPrio);
    }
}

function addBackgroundColor(prio, prioStatus, prioImgDeactive, prioImgActive) {
    prioStatus.classList.add(`at-bg-${prio}`);
    prioImgDeactive.style.display = 'none';
    prioImgActive.style.display = 'block';
}

function removeBackgroundColor(prio, prioStatus, prioImgDeactive, prioImgActive) {
    prioStatus.classList.remove(`at-bg-${prio}`);
    prioImgDeactive.style.display = 'block';
    prioImgActive.style.display = 'none';
}

function resetOtherPriorities(selectedPrio) {
    const priorities = ['urgent', 'medium', 'low'];
    priorities.forEach(prio => {
        if (prio !== selectedPrio) {
            let prioStatus = document.getElementById(prio);
            let prioImgDeactive = document.getElementById(`${prio}-img-deactive`);
            let prioImgActive = document.getElementById(`${prio}-img-active`);
            removeBackgroundColor(prio, prioStatus, prioImgDeactive, prioImgActive);
        }
    });
}

function showCategoryList() {
    let customSelects = document.querySelectorAll('.custom-category-select');
    customSelects.forEach(function (select) {
        let selectSelected = select.querySelector('.select-category-selected');
        let selectItems = select.querySelector('.select-category-items');
        let options = selectItems.querySelectorAll('.at-contact-layout');
        showCategoryDropdown(selectSelected, selectItems);
        chooseCategoryFromList(options, selectSelected, selectItems);
        window.addEventListener('click', function (e) {
            if (!select.contains(e.target)) {
                selectItems.style.display = 'none';
                let openIcon = document.getElementById('open-category-list');
                let closeIcon = document.getElementById('close-category-list');
                if (openIcon && closeIcon) {
                    openIcon.classList.remove('d-none');
                    closeIcon.classList.add('d-none');
                }
            }
        });
    });
}

function showCategoryDropdown(selectSelected, selectItems) {
    selectSelected.addEventListener('click', function () {
        if (selectItems.style.display === 'block') {
            selectItems.style.display = 'none';
            let openIcon = document.getElementById('open-category-list');
            let closeIcon = document.getElementById('close-category-list');
            if (openIcon && closeIcon) {
                openIcon.classList.remove('d-none');
                closeIcon.classList.add('d-none');
            }
        } else {
            selectItems.style.display = 'block';
            let openIcon = document.getElementById('open-category-list');
            let closeIcon = document.getElementById('close-category-list');
            if (openIcon && closeIcon) {
                openIcon.classList.add('d-none');
                closeIcon.classList.remove('d-none');
            }
        }
    });
}

function clearCategoryDropdown() {
    let customSelects = document.querySelectorAll('.custom-category-select');
    customSelects.forEach(function (select) {
        let selectSelected = select.querySelector('.select-category-selected');
        let selectItems = select.querySelector('.select-category-items');
        selectSelected.textContent = 'Select task category';
        selectItems.style.display = 'none';
        categoryChoosedIndex = 'false';
        categoryChoosed = '';
        let openIcon = document.getElementById('open-category-list');
        let closeIcon = document.getElementById('close-category-list');
        if (openIcon && closeIcon) {
            openIcon.classList.remove('d-none');
            closeIcon.classList.add('d-none');
        }
    });
}

function chooseCategoryFromList(options, selectSelected, selectItems) {
    options.forEach(function (option) {
        option.addEventListener('click', function () {
            selectSelected.textContent = option.querySelector('.at-contact-name').textContent;
            selectItems.style.display = 'none';
            categoryChoosedIndex = 'true';
            categoryChoosed = selectSelected.textContent;
            checkIfCategoryEmpty();
        });
    });
}

function checkRequiredInput() {
    let isTitleValid = checkIfTitleEmpty();
    let isDateValid = checkIfDateEmpty();
    let isCategoryValid = checkIfCategoryEmpty();

    return isTitleValid && isDateValid && isCategoryValid;
}

function checkIfTitleEmpty() {
    let title = document.getElementById('task-title');
    if (title.value === '') {
        document.getElementById('at-alert-title').classList.remove('d-none');
        title.style.borderColor = '#FF8190';
        return false;
    }
    else {
        document.getElementById('at-alert-title').classList.add('d-none');
        title.style.borderColor = '';
        return true;
    }
}

function checkIfDateEmpty() {
    let date = document.getElementById('task-due-date');

    if (date.value === '') {
        document.getElementById('at-alert-due-date').classList.remove('d-none');
        date.style.borderColor = '#FF8190';
        return false;
    }
    else {
        document.getElementById('at-alert-due-date').classList.add('d-none');
        date.style.borderColor = '';
        return true;
    }
}

function checkIfCategoryEmpty() {
    let category = document.getElementById('category-input');
    if (categoryChoosedIndex === 'false') {
        document.getElementById('at-alert-category').classList.remove('d-none');
        category.style.borderColor = '#FF8190';
        return false;
    }
    else {
        document.getElementById('at-alert-category').classList.add('d-none');
        category.style.borderColor = '';
        return true;

    }
}

function activateSubcategory() {
    let inputField = document.getElementById('add-subcategory');
    if (document.getElementById('at-subcategory-clear').classList.contains('d-none')) {
        document.getElementById('at-subcategory-clear').classList.remove('d-none');
        document.getElementById('at-subcategory-border').classList.remove('d-none');
        document.getElementById('at-subcategory-confirm').classList.remove('d-none');
        document.getElementById('at-subcategory-open').classList.add('d-none');
    }
    window.addEventListener('click', function (event) {
        if (!inputField.contains(event.target)) {
            document.getElementById('at-subcategory-clear').classList.add('d-none');
            document.getElementById('at-subcategory-border').classList.add('d-none');
            document.getElementById('at-subcategory-confirm').classList.add('d-none');
            document.getElementById('at-subcategory-open').classList.remove('d-none');
        }
    });
}

function clearInputSubcategory(event) {
    let inputField = document.getElementById('add-subcategory');
    event.stopPropagation();
    inputField.value = '';
}

function renderSubcategory() {
    let content = document.getElementById('added-subcategories');
    content.innerHTML = '';
    let subcategory = document.getElementById('add-subcategory');
    let newCategory = subcategory.value;
    if (newCategory !== '') {
        subcategoriesChoosed.push(newCategory);
        for (let i = 0; i < subcategoriesChoosed.length; i++) {
            let choosedSubcategorie = subcategoriesChoosed[i];
            content.innerHTML += /*html*/`
        <div class="choosed-subcategorie-container">
            <input class="choosed-subcategory-input" value="${choosedSubcategorie}" id="choosed-subcategory-${i}">
            <div class="choosed-subcategorie-btn-container">
                <img onclick="focusInput('choosed-subcategory-${i}')" class="at-choosed-subcategory-edit" src="assets/img/editDark.png" id="at-choosed-subcategory-edit-${i}">
                <div class="small-border-container"></div>
                <img onclick="removeSubcategory(${i})" class="at-choosed-subcategory-delete" src="assets/img/delete.png" id="at-choosed-subcategory-delete-${i}">
            </div>
            <div class="choosed-subcategorie-btn-container-active-field">
                <img onclick="removeSubcategory(${i})" class="at-choosed-subcategory-delete" src="assets/img/delete.png" id="at-choosed-subcategory-delete-active-${i}">
                <div class="small-border-container-gray"></div>
                <img class="at-choosed-subcategory-check" src="assets/img/checkOkDarrk.png" id="at-choosed-subcategory-check-active-${i}">
            </div>
        </div>
        `
        }
        subcategory.value = '';
    }
    else {
        for (let i = 0; i < subcategoriesChoosed.length; i++) {
            let choosedSubcategorie = subcategoriesChoosed[i];
            content.innerHTML += /*html*/`
        <div class="choosed-subcategorie-container">
            <input class="choosed-subcategory-input" value="${choosedSubcategorie}" id="choosed-subcategory-${i}">
            <div class="choosed-subcategorie-btn-container">
                <img onclick="focusInput('choosed-subcategory-${i}')" class="at-choosed-subcategory-edit" src="assets/img/editDark.png" id="at-choosed-subcategory-edit">
                <div class="small-border-container"></div>
                <img onclick="removeSubcategory(${i})" class="at-choosed-subcategory-delete" src="assets/img/delete.png" id="at-choosed-subcategory-delete">
            </div>
            <div class="choosed-subcategorie-btn-container-active-field">
                <img onclick="removeSubcategory(${i})" class="at-choosed-subcategory-delete" src="assets/img/delete.png" id="at-choosed-subcategory-delete-active">
                <div class="small-border-container-gray"></div>
                <img class="at-choosed-subcategory-check" src="assets/img/checkOkDarrk.png" id="at-choosed-subcategory-check-active">
            </div>
        </div>
        `
        }
    }
}

function removeAllSubcategory() {
    subcategoriesChoosed.splice(subcategoriesChoosed.length);
    renderSubcategory();
}

function focusInput(inputId) {
    document.getElementById(inputId).focus();
}

function removeSubcategory(i) {
    subcategoriesChoosed.splice(i, 1);
    renderSubcategory();
}

function clearTask() {
    let title = document.getElementById('task-title');
    let description = document.getElementById('at-description');
    let date = document.getElementById('task-due-date');

    title.value = '';
    description.value = '';
    choosedContacts = [];
    date.value = '';
    taskPrio = '';
    categoryChoosed = '';
    subcategoriesChoosed = [];
    renderAssignedToContacts();
    showChoosedContacts();
    showAvailableContacts();
    clearCategoryDropdown();
    renderSubcategory();
    resetOtherPriorities('reset');
}

async function addTask() {
    if (!checkRequiredInput()) {
        return;
    }
    let title = document.getElementById('task-title');
    let description = document.getElementById('at-description');
    let assignedTo = choosedContacts;
    let date = document.getElementById('task-due-date');
    let prio = taskPrio;
    task = {
        'title': title.value,
        'description': description.value,
        'assignedTo': assignedTo,
        'date': date.value,
        'prio': prio,
        'category': categoryChoosed,
        'subcategory': subcategoriesChoosed
    }
    await postTask("/task", task);
    ;
}

async function postTask(path, task) {
    let response = await fetch(BASE_URL + path + '.json', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(task)
    })
    return responseToJson = await response.json();
}

// Update the task type displayed in the overlay
function updateTaskType() {
    let taskType = document.getElementById('taskTypeSelect').value;
    document.getElementById('taskType').textContent = taskType;
}

// Create a new task and add it to the "To Do" column
window.createTask = function createTask() {
    let taskTitle = document.getElementById('task-title').value;
    let taskDescription = document.getElementById('at-description').value;
    let taskDueDate = document.getElementById('task-due-date').value;
    let taskPriority = getTaskPriority();
    let taskAssignee = choosedContacts.map(contact => contact.initial); // Get the initials of the selected contacts
    let taskType = getTaskType(); // Retrieve the selected task type

    let taskContainer = document.getElementById('toDo'); 

    let newTask = document.createElement('div');
    newTask.classList.add('card');
    newTask.setAttribute('draggable', 'true');
    newTask.setAttribute('onclick', 'on()'); 
    newTask.setAttribute('onclick', 'stopPropagation(event)'); 
    newTask.innerHTML = `
        <div class="cardContent>
            <span class="labelUser">${taskType === 'user-story' ? 'User Story' : 'Technical Task'}</span>
            <div class="contextContent">
                <span class="cardTitle">${taskTitle}</span>
                <div>
                    <span class="cardContext">${taskDescription}</span>
                </div>
                <div class="progressbar">
                    <div class="progressbarContainer">
                        <div class="bar" id="progressBar1"></div>
                    </div>
                    <div class="subtasks">0/0 Subtasks</div> <!-- Update dynamically if you have subtasks data -->
                </div>
                <div class="contactContainer">
                    <div style="display: flex;">
                        ${taskAssignee.map(name => `<div class="contactCard" style="background-color: rgb(232, 58, 133);">${name}</div>`).join('')}
                    </div>
                    <div>
                        <img class="urgentSymbol" src="${getPriorityIcon(taskPriority)}" alt="${taskPriority}">
                    </div>
                </div>
            </div>
        </div>
          <div>
            <div id="overlay" onclick="off()">
                <div class="overlayContent" onclick="stopPropagation(event)">
                    <section class="overlayUserTitle">
                        <span class="overlayUser">${taskType === 'user-story' ? 'User Story' : 'Technical Task'}</span>
                        <img class="closeButton" onclick="off()" src="./assets/img/Close.png" alt="">
                    </section>
                    <section>
                        <span class="overlayTitle">${taskTitle}</span>
                    </section>
                    <section class="overlayContext"><span>${taskDescription}</span></section>
                    <section class="dateDiv">
                        <span class="dueDate">Due date:</span> 
                        <span class="date">${taskDueDate}</span>
                    </section>
                    <section class="prioDiv">
                        <span class="prioOverlay">Priority:</span>
                        <span class="urgencyText">${taskPriority}
                            <img class="overlayUrgencyImg" src="${getPriorityIcon(taskPriority)}" alt="">
                        </span>
                    </section>
                    <section>
                        <span class="contactOverlay">Assigned To:</span>
                        ${taskAssignee.map(assignee => `
                            <div class="contactDiv">
                                <span class="contactCard" style="background-color: rgb(232, 58, 133);">${assignee.initial}</span>
                                <span class="contactName">${assignee.name}</span>
                            </div>
                        `).join('')}
                    </section>
                    <div class="subtasksOverlay"><span>Subtasks</span></div>
                    <div class="checkBoxDiv"><input type="checkbox" id="simpleCheckbox" class="checkBox"> <span class="checkBoxText">Implement Recipe Recommendation </span></div>
                    <div class="checkBoxDiv"><input type="checkbox" id="simpleCheckbox" class="checkBox"> <span class="checkBoxText">Start Page Layout</span></div>
                    <section>
                        <div class="editDiv">
                            <div class="deleteDiv"><img class="deletePng" src="./assets/img/delete (1).png" alt=""><span>Delete</span></div>
                            <div class="vector"></div>
                            <div class="deleteDiv"><img class="deletePng" src="./assets/img/edit (1).png" alt=""><span>Edit</span></div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    </div>
        
    `;

    newTask.addEventListener('click', function(event) {
        event.stopPropagation();
        on();
    });

        taskContainer.appendChild(newTask);
    
}

function createContactContainer(name) {

}

// Handle setting the background color for the selected priority
function setBackgroundColorPrio(prio) {
    // Get the priority elements
    let priorities = ['urgent', 'medium', 'low'];

    // Remove the background color and active state from all priorities
    priorities.forEach(function (priority) {
        let prioStatus = document.getElementById(priority);
        let prioImgDeactive = document.getElementById(`${priority}-img-deactive`);
        let prioImgActive = document.getElementById(`${priority}-img-active`);

        prioStatus.classList.remove(`at-bg-${priority}`);
        prioImgDeactive.style.display = 'block';
        prioImgActive.style.display = 'none';
    });

    // If the selected priority is already active, deactivate it
    if (document.getElementById(prio).classList.contains(`at-bg-${prio}`)) {
        document.getElementById(prio).classList.remove(`at-bg-${prio}`);
        document.getElementById(`${prio}-img-deactive`).style.display = 'block';
        document.getElementById(`${prio}-img-active`).style.display = 'none';
        taskPrio = ''; // No priority selected
    } else {
        // Activate the selected priority
        document.getElementById(prio).classList.add(`at-bg-${prio}`);
        document.getElementById(`${prio}-img-deactive`).style.display = 'none';
        document.getElementById(`${prio}-img-active`).style.display = 'block';
        taskPrio = prio;
    }

    console.log(taskPrio);
}

// Retrieve the selected priority for task creation
function getTaskPriority() {
    return taskPrio; // This should return the current priority selected
}


// Global variable to store the selected task type
let selectedTaskType = '';

// Function to handle task type selection
function selectTaskType(type) {
    selectedTaskType = type;

    // Example: Highlight the selected task type
    let types = ['technical', 'user-story'];
    types.forEach(t => {
        document.getElementById(t).classList.remove('selected');
    });

    document.getElementById(type).classList.add('selected');
}

// Retrieve the selected task type
function getTaskType() {
    return selectedTaskType;
}

function getPriorityIcon(priority) {
    switch (priority) {
        case 'urgent':
            return './assets/img/urgent.png';
        case 'medium':
            return './assets/img/medium.png';
        case 'low':
            return './assets/img/low.png';
        default:
            return './assets/img/default.png'; // Fallback icon
    }
}

function offAddTask() {
    const overlay = document.getElementById("addTaskOverlay");
    const overlayContent = document.querySelector(".overlayContentAddTask");

    overlayContent.classList.add("slide-out-content"); // Add the slide-out animation class
    overlay.classList.add("fade-out-overlay"); // Add the fade-out animation class

    // Wait for the animation to finish before hiding the overlay
    overlay.addEventListener("animationend", function() {
        overlay.style.display = "none"; // Hide the overlay
        overlay.classList.remove("fade-out-overlay"); // Remove the fade-out animation class
        overlayContent.classList.remove("slide-out-content"); // Remove the slide-out animation class
    }, { once: true }); // Ensure the event listener is only triggered once
}

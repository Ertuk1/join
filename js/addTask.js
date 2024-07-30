const BASE_URL = 'https://join-323f5-default-rtdb.europe-west1.firebasedatabase.app/';

let contacts = [
    { name: "Jan Möller" },
    { name: "Max Mustermann" },
    { name: "Sabine Musterfrau" },
    { name: "Jan Möller" },
    { name: "Max Mustermann" },
    { name: "Sabine Musterfrau" },
];

let contactColors = {};
let categoryChoosedIndex = 'false';
let categoryChoosed = '';
let subcategoriesChoosed = [];
let choosedContacts = [];
let taskPrio = '';
let task = {};

async function addTaskInit() {
    await includeHTML();
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
    goToBoard();
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

function goToBoard() {
    let bgAddedNote = document.getElementById('bg-task-added-note');
    bgAddedNote.style.zIndex = 100;
    let addedNote = document.getElementById('task-added-note');
    addedNote.classList.add('confirmation-task-creation-shown');
}


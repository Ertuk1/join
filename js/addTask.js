let contactColors = {};
let categoryChoosedIndex = 'false';
let categoryChoosed = '';
let subcategoriesChoosed = [];
let subtaskCompleted = [];
let choosedContacts = [];
let taskPrio = '';
let task = [];

/**
 * Initializes all components of the addtask.html.
 */
async function addTaskInit() {
    await includeHTML();
    await loadDataContacts();
    await renderAssignedToContacts();
    setupDropdownToggle();
    showAvailableContacts();
    showCategoryList();
    showInitials();
    setupContactSearchPlaceholder();
    setBackgroundColorPrio('medium');
}

/**
 * Creates the dropdown menus at the task creation process.
 * 
 */
function setupDropdownToggle() {
    const selectedElement = document.querySelector('.select-selected');
    const dropdownContainer = document.getElementById('at-contact-container');

    selectedElement.addEventListener('click', function (event) {
        event.stopPropagation();
        this.classList.toggle('select-arrow-active');
        dropdownContainer.classList.toggle('select-hide');
    });

    document.addEventListener('click', function (event) {
        if (!event.target.closest('.custom-select') && !event.target.closest('.select-items')) {
            dropdownContainer.classList.add('select-hide');
            selectedElement.classList.remove('select-arrow-active');
        }
    });
}

/**
 * Creates all possible contacts within the task creation process.
 * 
 */
async function renderAssignedToContacts() {
    let contentCollection = document.getElementsByClassName('select-items');

    for (let j = 0; j < contentCollection.length; j++) {
        let content = contentCollection[j];
        content.innerHTML = '';

        for (let i = 0; i < contacts.length; i++) {
            const contactName = contacts[i].name;
            let initials = contacts[i].initials;
            let color = contacts[i].profileColor;
            let id = contacts[i].id;


            content.innerHTML += generateAssignedContactsHTML(initials, contactName, id, color);
        }
    }
}


/**
 * Search function to find a specific contact.
 * 
 * @returns {string} -  error message or result of the search.
 */
function filterContacts() {
    const searchInput = document.getElementById('contact-search');
    if (!searchInput) {
        console.error('Element mit der ID "contact-search" wurde nicht gefunden.');
        return;
    }

    const searchValue = searchInput.value.toLowerCase();
    const filteredContacts = contacts.filter(contact => contact.name.toLowerCase().includes(searchValue));
    const contactContainer = document.getElementById('at-contact-container');
    if (!contactContainer) {
        console.error('Element mit der ID "at-contact-container" wurde nicht gefunden.');
        return;
    }

    contactContainer.innerHTML = '';
    filteredContacts.forEach(contact => {
        contactContainer.innerHTML += generateAssignedContactsHTML(contact.initials, contact.name, contact.id, contact.profileColor);
    });
    filteredContacts.forEach(contact => {
        updateCheckboxState(contact.id);
    });
}

/**
 * This functions adds one or more contacts to a task. 
 * 
 * @param {string} initials - initial of the contact
 * @param {string} id - id of the task
 * @param {string} color - background color of the contact initials
 */
function addContactToTask(initials, id, color) {
    let index = choosedContacts.findIndex(contact => contact.id === id);

    if (index === -1) {
        choosedContacts.push({
            id: id,
            initial: initials,
            color: color,
        });
    }
    showChoosedContacts();
    updateCheckboxState(id);
}

/**
 * Removes Contact from a task. 
 * 
 * @param {string} id - ID of an task.
 */
function removeContactFromTask(id) {
    choosedContacts = choosedContacts.filter(contact => contact.id !== id);
    showChoosedContacts();
    updateCheckboxState(id);
}

/**
 * Updates the status of a contact / checkbox.
 * 
 * @param {string} contactId - ID of the contact
 */
function updateCheckboxState(contactId) {
    const checkboxes = document.querySelectorAll(`input[data-contact-id="${contactId}"]`);
    checkboxes.forEach(checkbox => {
        checkbox.checked = choosedContacts.some(contact => contact.id === contactId);
    });
}

/**
 * This function shows all assigend contacts to a task. 
 * 
 */
function showChoosedContacts() {
    let content = document.getElementById('at-selected-contacts');
    content.innerHTML = '';
    let maxVisibleContacts = 4;

    for (let i = 0; i < choosedContacts.length && i < maxVisibleContacts; i++) {
        let contact = choosedContacts[i].initial;
        let color = choosedContacts[i].color;

        content.innerHTML += `<div class="at-choosed-contact-shortcut" id="at-choosed-shortcut${i}">
                                <div class="at-contact-shortcut">${contact}</div>
                              </div>`;

        let backgroundColor = document.getElementById(`at-choosed-shortcut${i}`);
        backgroundColor.style.backgroundColor = color;
    }

    if (choosedContacts.length > maxVisibleContacts) {
        let remainingCount = choosedContacts.length - maxVisibleContacts;
        content.innerHTML += `<div class="at-choosed-contact-shortcut" style="background-color: rgb(218, 42, 224);">
                                <div class="at-contact-shortcut">+${remainingCount}</div>
                              </div>`;
    }
}


/**
 * This function shows all available contacts.
 * 
 */
function showAvailableContacts() {
    const customSelects = document.querySelectorAll('.custom-select');

    customSelects.forEach(select => {
        const selectSelected = select.querySelector('.select-selected');
        const selectItems = select.querySelector('.select-items');
        const options = selectItems.querySelectorAll('.at-contact-layout');
        selectItems.style.display = 'none';

        showContactList(selectSelected, selectItems, customSelects);
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

/**
 * This is a function to toggle the checkbox of a contact. 
 * 
 * @param {string} contactId - ID of the contact
 */
function toggleCheckbox(contactId) {
    const checkbox = document.querySelector(`input[data-contact-id="${contactId}"]`);

    if (!checkbox) return;

    checkbox.checked = !checkbox.checked;
    const selectedContact = contacts.find(contact => contact.id === contactId);
    const contactLayout = checkbox.closest('.at-contact-layout');

    if (checkbox.checked) {
        addContactToTask(selectedContact.initials, contactId, selectedContact.profileColor);

        if (contactLayout) {
            contactLayout.style.backgroundColor = '#2a3647e0';
            contactLayout.style.color = 'white'
        }
    } else {
        removeContactFromTask(contactId);

        if (contactLayout) {
            contactLayout.style.backgroundColor = '';
            contactLayout.style.color = 'black'
        }
    }
}


/**
 * Opens the dropdown menu with all availabe contacts. 
 * 
 * @param {string} selectSelected - div container within the dropdown menu
 * @param {string} selectItems - div container within the dropdown menu
 * @param {string} customSelects - div container within the dropdown menu
 */
function showContactList(selectSelected, selectItems, customSelects) {
    selectSelected.addEventListener('click', function (event) {
        event.stopPropagation(); 
        customSelects.forEach(function (s) {
            s.querySelector('.select-items').style.display = 'none';
        });

        if (selectItems.style.display === 'block') {
            selectItems.style.display = 'none';
        } else {
            selectItems.style.display = 'block';
        }

        if (selectItems.style.display === 'block') {
            document.getElementById('open-contact-list').classList.add('d-none');
            document.getElementById('close-contact-list').classList.remove('d-none');
        } else {
            document.getElementById('open-contact-list').classList.remove('d-none');
            document.getElementById('close-contact-list').classList.add('d-none');
        }
    });

    document.addEventListener('click', function (event) {
        if (!event.target.closest('.custom-select') && !event.target.closest('.select-items')) {
            selectItems.style.display = 'none';
            document.getElementById('open-contact-list').classList.remove('d-none');
            document.getElementById('close-contact-list').classList.add('d-none');
        }
    });
}

/**
 * This is function is used to choose a specific contact from the list. 
 * 
 * @param {*} options - An available contact.
 */
function chooseContactFromList(options) {
    options.forEach(option => {
        option.addEventListener('click', function (event) {
            event.stopPropagation(); 
            const checkbox = option.querySelector('input[type="checkbox"]');
            const contactId = option.querySelector('input').dataset.contactId;
            checkbox.checked = !checkbox.checked;
            toggleCheckbox(contactId);
        });
    });
}

/**
 * This function sets the backgroundcolor of the priority of the task.
 * 
 * @param {string} prio - priority of the task
 */
function setBackgroundColorPrio(prio) {
    let prioStatus = document.getElementById(prio);
    let prioImgDeactive = document.getElementById(`${prio}-img-deactive`);
    let prioImgActive = document.getElementById(`${prio}-img-active`);
    resetOtherPriorities(prio);

    if (prioStatus.classList.contains(`at-bg-${prio}`)) {
        removeBackgroundColor(prio, prioStatus, prioImgDeactive, prioImgActive);
        taskPrio = '';
    } else {
        addBackgroundColor(prio, prioStatus, prioImgDeactive, prioImgActive);
        taskPrio = prio;
    }
}

/**
 * This function adds the backgroundcolor to the task. 
 * 
 * @param {string} prio - priority of the task.
 * @param {string} prioStatus - status of the task
 * @param {string} prioImgDeactive - deactivated status
 * @param {string} prioImgActive - activated status
 */
function addBackgroundColor(prio, prioStatus, prioImgDeactive, prioImgActive) {
    prioStatus.classList.add(`at-bg-${prio}`);
    prioImgDeactive.style.display = 'none';
    prioImgActive.style.display = 'block';
}

/**
 * This function removes the backgroundcolor to the task. 
 * 
 * @param {string} prio - priority of the task.
 * @param {string} prioStatus - status of the task
 * @param {string} prioImgDeactive - deactivated status
 * @param {string} prioImgActive - activated status
 */
function removeBackgroundColor(prio, prioStatus, prioImgDeactive, prioImgActive) {
    prioStatus.classList.remove(`at-bg-${prio}`);
    prioImgDeactive.style.display = 'block';
    prioImgActive.style.display = 'none';
}

/**
 * This function resets the not choosen priorites. 
 * 
 * @param {string} selectedPrio - the seleceted priority of a task
 */
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

/**
 * This function shows the available category items of a task. 
 * 
 */
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

/**
 * This function shows the dropdown menü of the available categories.
 * 
 * @param {string} selectSelected - div container of a 
 * @param {string} selectItems - div container of a 
 */
function showCategoryDropdown(selectSelected, selectItems) {
    selectSelected.addEventListener('click', function (event) {
        event.stopPropagation(); 
        if (selectItems.style.display === 'block') {
            selectItems.style.display = 'none';

        } else {
            selectItems.style.display = 'block';

        }
    });

    document.addEventListener('click', function (event) {
        if (!event.target.closest('.custom-category-select')) {
            selectItems.style.display = 'none';
        }
    });
}

/**
 * This functions clears and close the dropdown of the category menu.
 */
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

/**
 * This function assigne a category to a task. 
 * 
 * @param {string} options - available categories
 * @param {*} selectSelected - div container of a dropdown
 * @param {*} selectItems - div container of a dropdown
 */
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

/**
 * This function checks the status of all required input fields.
 * 
 */
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

/**
 * This function checks the status of the date field.
 * 
 */
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

/**
 * This function checks the status of the category dropdown. 
 *
 */
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

/**
 * This function enable the subcategory section. 
 * 
 */
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

/**
 * This function clears the input field at the subcategory section. 
 * @param {*} event - 
 */
function clearInputSubcategory(event) {
    let inputField = document.getElementById('add-subcategory');
    event.stopPropagation();
    inputField.value = '';
}

/**
 * This function renders all added subcategories of a task.
 * 
 */
function renderSubcategory() {
    let content = document.getElementById('added-subcategories');
    content.innerHTML = '';
    let subcategory = document.getElementById('add-subcategory');
    let newCategory = subcategory.value;
    if (newCategory !== '') {
        subcategoriesChoosed.push(newCategory);
        subtaskCompleted.push('false');
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

/**
 * This function removes all subcategories. 
 * 
 */
function removeAllSubcategory() {
    subcategoriesChoosed.splice(subcategoriesChoosed.length);
    renderSubcategory();
}

/**
 * This function activate the current input field.
 * 
 * @param {string} inputId - ID of the input field / subcategorie
 */
function focusInput(inputId) {
    document.getElementById(inputId).focus();
}

/**
 * This function remove the specific subcategorie.
 * 
 * @param {string} i - ID of the subcategorie.
 */
function removeSubcategory(i) {
    subcategoriesChoosed.splice(i, 1);
    subtaskCompleted.splice(i, 1);
    renderSubcategory();
}

/**
 * This functions clears the task formular.
 * 
 */
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

/**
 * This function forwared the user to the board html after the creation of a task. 
 * 
 */
function goToBoard() {
    let bgAddedNote = document.getElementById('bg-task-added-note');
    bgAddedNote.style.zIndex = 100;
    let addedNote = document.getElementById('task-added-note');
    addedNote.classList.add('confirmation-task-creation-shown');
    setTimeout(function () {
        window.location.href = 'board.html';
    }, 2000);
}

/**
 * This function setup the contact search placeholder.
 * 
 */

function setupContactSearchPlaceholder() {
    const searchInput = document.getElementById('contact-search');
    const originalPlaceholder = document.getElementById('original-placeholder');

    if (!searchInput || !originalPlaceholder) {
        console.error('Elemente "contact-search" oder "original-placeholder" wurden nicht gefunden.');
        return;
    }

    searchInput.addEventListener('focus', function () {
        originalPlaceholder.style.display = 'none'; 
    });

    searchInput.addEventListener('blur', function () {
        if (this.value === '') {
            originalPlaceholder.style.display = 'block';
        }
    });
}






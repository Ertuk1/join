let contactColors = {};
let categoryChoosedIndex = 'false';
let categoryChoosed = '';
let subcategoriesChoosed = [];
let subtaskCompleted = [];
let choosedContacts = [];
let taskPrio = '';
let task = [];

async function addTaskInit() {
    await includeHTML();
    await loadDataContacts();
    await renderAssignedToContacts();
    setupDropdownToggle(); 
    showAvailableContacts();
    showCategoryList();
    showInitials();
}

function setupDropdownToggle() {
    const selectedElement = document.querySelector('.select-selected');
    const dropdownContainer = document.getElementById('at-contact-container');

    selectedElement.addEventListener('click', function () {
        this.classList.toggle('select-arrow-active');
        dropdownContainer.classList.toggle('select-hide');
    });
    
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.custom-select')) {
            dropdownContainer.classList.add('select-hide');
            selectedElement.classList.remove('select-arrow-active');
        }
    });
}


async function renderAssignedToContacts() {
    const contactContainer = document.getElementById('at-contact-container');
    contactContainer.innerHTML = '';  // Leere den Inhalt
    for (let i = 0; i < contacts.length; i++) {
        const contactName = contacts[i].name;
        const initials = contacts[i].initials;
        const color = contacts[i].profileColor;
        const id = contacts[i].id;

        // HTML für jeden Kontakt generieren
        contactContainer.innerHTML += generateAssignedContactsHTML(initials, contactName, id, color);
    }
}


function filterContacts() {
    const searchValue = document.getElementById('contact-search').value.toLowerCase();
    const filteredContacts = contacts.filter(contact => contact.name.toLowerCase().includes(searchValue));

    const contactContainer = document.getElementById('at-contact-container');
    contactContainer.innerHTML = ''; // Clear the previous results

    filteredContacts.forEach(contact => {
        // Generate the contact HTML
        contactContainer.innerHTML += generateAssignedContactsHTML(contact.initials, contact.name, contact.id, contact.profileColor);
    });

    // After filtering, update the checkbox states
    filteredContacts.forEach(contact => {
        updateCheckboxState(contact.id);
    });
}

function generateAssignedContactsHTML(initials, contactName, id, color) {
    return `
        <div class="at-contact-layout" onclick="toggleCheckbox('${id}')">
            <div class="at-contact-name-container">
                <div class="at-contact-shortcut-layout" style="background-color: ${color};">
                    <div class="at-contact-shortcut">${initials}</div>
                </div>
                <div class="at-contact-name">${contactName}</div>
            </div>
            <label class="at-label-checkbox">
                <input data-contact-id="${id}" data-contact-color="${color}" data-contact-initials="${initials}" type="checkbox">
                <span class="at-checkmark"></span>
            </label>
        </div>`;
}




function addContactToTask(initials, id, color) {
    // Überprüfe, ob der Kontakt bereits in der Liste ist
    let index = choosedContacts.findIndex(contact => contact.id === id);

    if (index === -1) {
        // Kontakt ist noch nicht ausgewählt, füge ihn hinzu
        choosedContacts.push({
            id: id,
            initial: initials,
            color: color,
        });
    }

    showChoosedContacts(); // Zeige die ausgewählten Kontakte an
    updateCheckboxState(id); // Aktualisiere den Zustand der Checkboxen
}

function removeContactFromTask(id) {
    // Entferne den Kontakt aus der Liste der ausgewählten Kontakte
    choosedContacts = choosedContacts.filter(contact => contact.id !== id);

    showChoosedContacts(); // Zeige die ausgewählten Kontakte an
    updateCheckboxState(id); // Aktualisiere den Zustand der Checkboxen
}


function updateCheckboxState(contactId) {
    const checkboxes = document.querySelectorAll(`input[data-contact-id="${contactId}"]`);
    checkboxes.forEach(checkbox => {
        // Ensure the checkbox reflects the selection state
        checkbox.checked = choosedContacts.some(contact => contact.id === contactId);
    });
}


function showChoosedContacts() {
    let content = document.getElementById('at-selected-contacts');
    content.innerHTML = '';  // Leere den Bereich, bevor du neue Inhalte hinzufügst
    
    for (let i = 0; i < choosedContacts.length; i++) {
        let contact = choosedContacts[i].initial;
        let color = choosedContacts[i].color;
        
        // Zeige ausgewählte Kontakte mit ihren Farben und Initialen an
        content.innerHTML += `<div class="at-choosed-contact-shortcut" id="at-choosed-shortcut${i}">
                                <div class="at-contact-shortcut">${contact}</div>
                              </div>`;
        
        // Setze den Hintergrund für die Kontakte
        let backgroundColor = document.getElementById(`at-choosed-shortcut${i}`);
        backgroundColor.style.backgroundColor = color;
    }
}


function showAvailableContacts() {
    const customSelects = document.querySelectorAll('.custom-select');

    customSelects.forEach(select => {
        const selectSelected = select.querySelector('.select-selected');
        const selectItems = select.querySelector('.select-items');
        const options = selectItems.querySelectorAll('.at-contact-layout');
        
        // Hide the contact list by default
        selectItems.style.display = 'none';

        // Handle showing contact list and selection
        showContactList(selectSelected, selectItems);
        chooseContactFromList(options);

        // Close the list if clicked outside the dropdown
        window.addEventListener('click', function (event) {
            if (!select.contains(event.target)) {
                selectItems.style.display = 'none';
                document.getElementById('open-contact-list').classList.remove('d-none');
                document.getElementById('close-contact-list').classList.add('d-none');
            }
        });
    });
}

function toggleCheckbox(contactId) {
    const checkbox = document.querySelector(`input[data-contact-id="${contactId}"]`);

    if (!checkbox) return;

    // Toggle checkbox state
    checkbox.checked = !checkbox.checked;

    // Find the contact by ID
    const selectedContact = contacts.find(contact => contact.id === contactId);

    // Add or remove the contact from the selected list based on checkbox state
    if (checkbox.checked) {
        addContactToTask(selectedContact.initials, contactId, selectedContact.profileColor);
    } else {
        removeContactFromTask(contactId);
    }
}



function showContactList(selectSelected, selectItems) {
    selectSelected.addEventListener('click', function (event) {
        event.stopPropagation();

        // Toggle-Logik für das Dropdown
        const isVisible = selectItems.style.display === 'block';
        
        // Schließe alle anderen geöffneten Dropdowns
        document.querySelectorAll('.select-items').forEach(function (item) {
            item.style.display = 'none';
        });

        // Toggle das aktuelle Dropdown
        selectItems.style.display = isVisible ? 'none' : 'block';

        // Zeige und verstecke die Icons entsprechend
        if (isVisible) {
            document.getElementById('open-contact-list').classList.remove('d-none');
            document.getElementById('close-contact-list').classList.add('d-none');
        } else {
            document.getElementById('open-contact-list').classList.add('d-none');
            document.getElementById('close-contact-list').classList.remove('d-none');
        }
    });
}

function chooseContactFromList(options) {
    options.forEach(option => {
        option.addEventListener('click', function () {
            const checkbox = option.querySelector('input[type="checkbox"]');
            const contactId = option.querySelector('input').dataset.contactId;

            // Toggle the checkbox and update the selected contacts
            checkbox.checked = !checkbox.checked;
            toggleCheckbox(contactId);
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
    } else {
        addBackgroundColor(prio, prioStatus, prioImgDeactive, prioImgActive);
        taskPrio = prio;
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

function removeAllSubcategory() {
    subcategoriesChoosed.splice(subcategoriesChoosed.length);
    renderSubcategory();
}

function focusInput(inputId) {
    document.getElementById(inputId).focus();
}

function removeSubcategory(i) {
    subcategoriesChoosed.splice(i, 1);
    subtaskCompleted.splice(i, 1);
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

function goToBoard() {
    let bgAddedNote = document.getElementById('bg-task-added-note');
    bgAddedNote.style.zIndex = 100;
    let addedNote = document.getElementById('task-added-note');
    addedNote.classList.add('confirmation-task-creation-shown');
    setTimeout(function () {
        window.location.href = 'board.html';
    }, 2000);
}

document.getElementById('contact-search').addEventListener('focus', function() {
    const originalPlaceholder = document.getElementById('original-placeholder');
    originalPlaceholder.style.display = 'none'; // Hide the placeholder on focus
});

document.getElementById('contact-search').addEventListener('blur', function() {
    if (this.value === '') {
        const originalPlaceholder = document.getElementById('original-placeholder');
        originalPlaceholder.style.display = 'block'; // Show the placeholder if input is empty
    }
});







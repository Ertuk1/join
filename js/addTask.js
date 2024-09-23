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
 * Checks the value of inputs with the class 'choosed-subcategory-input'.
 * If an input is empty, it removes the 'at-choosed-subcategory-check' class from its parent element.
 * @function
 * @returns {void}
 */
function checkSubcategoryInputs() {
    const inputs = document.querySelectorAll('.choosed-subcategory-input');
    
    inputs.forEach(input => {
        const value = input.value.trim();
        const image = input.closest('.choosed-subcategorie-container').querySelector('.at-choosed-subcategory-check'); // Adjust selector as needed

        if (image) { // Ensure the image exists
            if (!value) {
                image.classList.add('d-none'); // Add d-none class if input is empty
            } else {
                image.classList.remove('d-none'); // Remove d-none class if input is not empty
            }
        } else {
            console.warn('Image with class at-choosed-subcategory-check not found');
        }
    });
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
 * Filters contacts based on the search input and updates the contact container.
 * @function
 * @returns {void}
 */
function filterContacts() {
    const searchValue = getSearchValue();
    const filteredContacts = contacts.filter(contact => contact.name.toLowerCase().includes(searchValue));
    updateContactContainer(filteredContacts);
}


/**
 * Retrieves the search input value.
 * @function
 * @returns {string} - The search input value in lowercase.
 */
function getSearchValue() {
    const searchInput = document.getElementById('contact-search');
    return searchInput ? searchInput.value.toLowerCase() : '';
}

/**
 * Updates the contact container with the filtered contacts.
 * @function
 * @param {Array} filteredContacts - The array of filtered contact objects.
 * @returns {void}
 */
function updateContactContainer(filteredContacts) {
    const contactContainer = document.getElementById('at-contact-container');
    if (!contactContainer) return;
    contactContainer.innerHTML = filteredContacts.map(contact =>
        generateAssignedContactsHTML(contact.initials, contact.name, contact.id, contact.profileColor)
    ).join('');
    filteredContacts.forEach(contact => updateCheckboxState(contact.id));
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
 * Displays the chosen contacts and limits the visible count.
 * @function
 * @returns {void}
 */
function showChoosedContacts() {
    const content = document.getElementById('at-selected-contacts');
    const maxVisibleContacts = 4;
    content.innerHTML = getChoosedContactsHTML(maxVisibleContacts);
    applyContactBackgrounds(maxVisibleContacts);
}

/**
 * Applies background colors to the selected contacts.
 * @function
 * @param {number} maxVisibleContacts - The maximum number of contacts to display.
 * @returns {void}
 */
function applyContactBackgrounds(maxVisibleContacts) {
    choosedContacts.slice(0, maxVisibleContacts).forEach((contact, i) => {
        document.getElementById(`at-choosed-shortcut${i}`).style.backgroundColor = contact.color;
    });
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
 * Toggles the checkbox for a contact and updates selection state.
 * @function
 * @param {string} contactId - The ID of the contact.
 * @returns {void}
 */
function toggleCheckbox(contactId) {
    const checkbox = document.querySelector(`input[data-contact-id="${contactId}"]`);
    if (!checkbox) return;

    checkbox.checked = !checkbox.checked;
    const contactLayout = checkbox.closest('.at-contact-layout');
    const { initials, profileColor } = contacts.find(contact => contact.id === contactId);

    checkbox.checked ? handleContactSelection(contactId, initials, profileColor, contactLayout, true)
                     : handleContactSelection(contactId, initials, profileColor, contactLayout, false);
}

/**
 * Handles the selection or removal of a contact in a task.
 * @function
 * @param {string} contactId - The ID of the contact.
 * @param {string} initials - The initials of the contact.
 * @param {string} profileColor - The profile color of the contact.
 * @param {HTMLElement} layout - The layout element for the contact.
 * @param {boolean} isSelected - Indicates if the contact is selected.
 * @returns {void}
 */
function handleContactSelection(contactId, initials, profileColor, layout, isSelected) {
    isSelected ? addContactToTask(initials, contactId, profileColor)
               : removeContactFromTask(contactId);

    if (layout) {
        layout.style.backgroundColor = isSelected ? '#2a3647e0' : 'white';
        layout.style.color = isSelected ? 'white' : 'black';
    }
}


/**
 * toggels contactlist open or close depending on if closed or opened
 * 
 */
function showContactList(selectSelected, selectItems, customSelects) {
    const toggleIcon = (isOpen) => {
        document.getElementById('open-contact-list').classList.toggle('d-none', isOpen);
        document.getElementById('close-contact-list').classList.toggle('d-none', !isOpen);
    };
    selectSelected.addEventListener('click', (event) => {
        event.stopPropagation();
        customSelects.forEach(s => s.querySelector('.select-items').style.display = 'none');
        selectItems.style.display = (selectItems.style.display === 'block') ? 'none' : 'block';
        toggleIcon(selectItems.style.display === 'block');
    });
    document.addEventListener('click', (event) => {
        if (!event.target.closest('.custom-select, .select-items')) {
            selectItems.style.display = 'none';
            toggleIcon(false);
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


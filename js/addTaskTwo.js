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
    const toggleCategoryIcons = (isOpen) => {
        document.getElementById('open-category-list')?.classList.toggle('d-none', isOpen);
        document.getElementById('close-category-list')?.classList.toggle('d-none', !isOpen);
    };
    document.querySelectorAll('.custom-category-select').forEach(select => {
        let selectSelected = select.querySelector('.select-category-selected');
        let selectItems = select.querySelector('.select-category-items');
        let options = selectItems.querySelectorAll('.at-contact-layout');
        showCategoryDropdown(selectSelected, selectItems);
        chooseCategoryFromList(options, selectSelected, selectItems);
        window.addEventListener('click', (e) => {
            if (!select.contains(e.target)) {
                selectItems.style.display = 'none';
                toggleCategoryIcons(false);
            }
        });
    });
}

/**
 * function to handle the dropdown in category
 * 
 */
function showCategoryDropdown(selectSelected, selectItems) {
    const toggleDropdown = (show) => selectItems.style.display = show ? 'block' : 'none';

    selectSelected.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleDropdown(selectItems.style.display !== 'block');
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.custom-category-select')) toggleDropdown(false);
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

/**
 * This function checks if task title is empty for form vallidation
 * 
 */
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
    let currentDate = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format

    if (date.value === '') {
        document.getElementById('at-alert-due-date').classList.remove('d-none');
        date.style.borderColor = '#FF8190';
        return false;
    } else if (date.value < currentDate) {
        document.getElementById('at-alert-due-date').textContent = 'Date cannot be in the past';
        document.getElementById('at-alert-due-date').classList.remove('d-none');
        date.style.borderColor = '#FF8190';
        return false;
    } else {
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
 */
function renderSubcategory() {
    const content = document.getElementById('added-subcategories');
    const subcategory = document.getElementById('add-subcategory');
    const newCategory = subcategory.value.trim();
    if (newCategory) {
        subcategoriesChoosed.push(newCategory);
        subtaskCompleted.push('false');
        subcategory.value = '';
    }
    content.innerHTML = subcategoriesChoosed.map((subcategory, i) => getSubcategoryTemplate(subcategory, i)).join('');
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
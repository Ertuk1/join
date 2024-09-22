/**
 * Returns the icon path based on the task priority.
 * @param {string} priority - The priority of the task ('urgent', 'medium', 'low').
 * @returns {string} - The path to the corresponding priority icon.
 */
function getPriorityIcon(priority) {
    switch (priority) {
        case 'urgent':
            return './assets/img/urgent.png';
        case 'medium':
            return './assets/img/medium.png';
        case 'low':
            return './assets/img/low.png';
        default:
            return '';
    }
}

/**
 * Shows the edit overlay for a specific task.
 * @async
 * @param {string} id - The ID of the task to edit.
 * Load the tasks from the backend
 * Find the specific task by its ID
 * Remove all elements with the specified classes
 * Removes the element from the DOM
 * Check assigned contacts and update checkboxes
 * Use assignedTo from task
 * Mark the checkbox as checked
 * Generate the subtask HTML if the task has subcategories
 */
async function ShowEditOverlay(id) {
    await loadDataTask();

    const task = tasks.find(task => task.id === id);

    if (task) {
        const { title, description, date, prio, subcategory, assignedTo } = task;
        choosedContacts = []
        subcategoriesChoosed = [...subcategory];
        choosedContacts = [... assignedTo];

        await initializeEditTask(id);
        hideAddTaskElements();
        clearTaskEditOverlay();

        const taskAssigneeHTML = getTaskAssignee(assignedTo);
        updateAssigneeContainer(taskAssigneeHTML);
        setupSaveButton(id);

        checkAssignedContacts(assignedTo);
        const subtaskHTML = Array.isArray(subcategory) ? getEditSubtaskHTML(subcategory) : '';
        renderEditTaskData(id, title, description, date, prio, subtaskHTML);
    } else {
        console.error('Task not found');
    }
}

/**
 * Initializes the edit task overlay by adding necessary setup and displaying the overlay.
 * @param {string} id - The unique identifier for the task being edited.
 * @returns {Promise<void>} A promise that resolves when the initialization is complete.
 */
async function initializeEditTask(id) {
    await addTaskInit();
    document.getElementById(`edit-task-overlay${id}`).classList.remove('d-none');
    const mainInputContainer = document.getElementById(`edit-main-input-container${id}`);
    mainInputContainer.classList.remove('main-input-container');
    mainInputContainer.classList.add('edit-main-input-container');
    document.querySelector('.right-left-container').style.display = 'block';
}

/**
 * Hides the elements related to adding a task by adding a 'd-none' class to them.
 */
function hideAddTaskElements() {
    const elementsToHide = [
        'input-border-container', 'at-alert-description', 'at-btn-container',
        'category-headline', 'category-input', 'at-subcategory-open', 'editDiv'
    ];
    elementsToHide.forEach(id => document.getElementById(id)?.classList.add('d-none'));
}

/**
 * Clears the task edit overlay by removing specific overlay elements from the DOM.
 */
function clearTaskEditOverlay() {
    const elementsToRemove = document.querySelectorAll('.contactOverlay, .contactDiv, .subtaskOverlay, .checkBoxDiv, .subtasksOverlay, .dateDiv, .prioDiv, .overlayTitle');
    elementsToRemove.forEach(element => element.remove());
}

/**
 * Updates the assignee container with the provided HTML for task assignees.
 * @param {string} taskAssigneeHTML - The HTML string to be set as the innerHTML of the assignee container.
 */
function updateAssigneeContainer(taskAssigneeHTML) {
    const assigneeContainer = document.getElementById('at-selected-contacts');
    if (assigneeContainer) {
        assigneeContainer.innerHTML = taskAssigneeHTML;
    } else {
        console.warn('Assignee container not found.');
    }
}

/**
 * Sets up the save button for editing tasks by adding a click event listener to it.
 * @param {string} id - The unique identifier for the task being edited.
 */
function setupSaveButton(id) {
    const saveButton = document.querySelector('.board-task-edit-btn');
    saveButton.addEventListener('click', () => saveTaskChanges(id));
}

/**
 * Checks and marks assigned contacts in the UI based on the provided list of assigned contacts.
 * @param {Array<Object|string>} assignedTo - An array of assigned contact objects or IDs.
 */
function checkAssignedContacts(assignedTo) {
    const assignedContacts = assignedTo || [];
    assignedContacts.forEach(contact => {
        const contactId = contact.id || contact;
        const checkbox = document.querySelector(`input[data-contact-id="${contactId}"]`);

        if (checkbox) {
            checkbox.checked = true;
            const contactLayout = checkbox.closest('.at-contact-layout');
            if (contactLayout) {
                contactLayout.style.backgroundColor = '#2a3647e0';
                contactLayout.style.color = 'white';
            }
        } else {
            console.warn(`Checkbox with ID ${contactId} not found.`);
        }
    });
}

/**
 * Renders the task data in the edit overlay.
 * @param {string} id - The ID of the task.
 * @param {string} taskTitle - The title of the task.
 * @param {string} taskDescription - The description of the task.
 * @param {string} taskDueDate - The due date of the task.
 * @param {string} taskPriority - The priority of the task.
 * @param {string} subtaskHTML - The HTML for the subtasks.
 * Ensure correct rendering before setting priority background
 * Assign the generated HTML or an empty string if there are no subtasks
 * Set the priority icon
 */
function renderEditTaskData(id, taskTitle, taskDescription, taskDueDate, taskPriority, subtaskHTML) {
    document.getElementById('task-title').value = taskTitle;
    document.getElementById('at-description').value = taskDescription;
    document.getElementById('task-due-date').value = taskDueDate;
    document.getElementById('added-subcategories').innerHTML = subtaskHTML;

    const priorityIcon = getPriorityIcon(taskPriority);
    const priorityIconElement = document.getElementById('priority-icon');

    if (priorityIconElement && priorityIcon) {
        priorityIconElement.src = priorityIcon;
    }
    
    requestAnimationFrame(() => {
        setBackgroundColorPrio(taskPriority);
    });
}

/**
 * Gets the selected priority level for a task.
 * @returns {string} The selected priority ('urgent', 'medium', or 'low').
 */
function getSelectedPriority() {
    const priorityElements = document.querySelectorAll('.at-prio-item');
    for (const element of priorityElements) {
        if (element.classList.contains('at-bg-urgent')) {
            return 'urgent';
        } else if (element.classList.contains('at-bg-medium')) {
            return 'medium';
        } else if (element.classList.contains('at-bg-low')) {
            return 'low';
        }
    }
    return 'low'; 
}
async function initBoard() {
    await loadDataTask();
    await loadDataContacts();
    await includeHTML();
    checkIfEmpty();
    renderTasks();
    showInitials();
}
/**
 * Renders the tasks in their respective columns and updates the UI.
 * Generate task card using a template
 * Attach click event listener
 * Append task to the appropriate column
 * Update progress bar
 * Ensure columns display empty messages if needed
 */
function renderTasks() {
    const columns = getColumns();
    clearColumns(columns);

    tasks.forEach((task, i) => {
        let newTask = createTaskElement(task, i);
        let targetColumn = columns[task.status] || columns.toDo;
        targetColumn.appendChild(newTask);
        updateProgressBarForTask(task, i);
    });

    checkIfEmpty();
}

function getColumns() {
    return {
        toDo: document.getElementById('toDo'),
        progress: document.getElementById('progress'),
        feedback: document.getElementById('feedback'),
        done: document.getElementById('done')
    };
}

function clearColumns(columns) {
    Object.values(columns).forEach(column => column.innerHTML = '');
}

function createTaskElement(task, index) {
    const { id, subcategory, completedSubtasks, assignedTo, category, prio, status } = task;
    let subtaskHTML = getSubtask(task);
    let editSubtask = getEditSubtaskHTML(subcategory);
    let completedCount = completedSubtasks.filter(completed => completed === 'true').length;
    let taskAssignee = getTaskAssignee(assignedTo);
    let taskPriorityIcon = getPriorityIcon(prio);
    let taskTypeBackgroundColor = category === 'User Story' ? '#1FD7C1' : '';

    let newTask = document.createElement('div');
    newTask.innerHTML = getTaskTemplate(task, index, taskTypeBackgroundColor, category, taskAssignee, taskPriorityIcon, completedCount, editSubtask, id, subtaskHTML);
    newTask.addEventListener('click', event => {
        event.stopPropagation();
        showOverlay1(task.title, task.description, task.date, prio, assignedTo, category, subtaskHTML, id, editSubtask);
    });

    return newTask;
}

function updateProgressBarForTask(task, index) {
    let completedCount = task.completedSubtasks.filter(completed => completed === 'true').length;
    updateProgressBar(completedCount, task.subcategory.length, index);
}

/**
 * Retrieves the HTML for task assignees and handles overflow if there are more than three assignees.
 * @param {Array} assignedTo - Array of assigned contact objects.
 * @returns {string} - HTML string representing the task assignees.
 */
function getTaskAssignee(assignedTo) {
    if (!Array.isArray(assignedTo) || assignedTo.length === 0) return '';

    let visibleAssignees = assignedTo.slice(0, 3);
    let taskAssignee = visibleAssignees.map(assignee => {
        let contact = contacts.find(contact => contact.id === assignee.id);
        return contact ? `<div class="contactCard" style="background-color: ${assignee.color};">${assignee.initial}</div>` : '';
    }).join('');

    let remainingAssignees = assignedTo.length - visibleAssignees.length;
    if (remainingAssignees > 0) {
        taskAssignee += `<div class="contactCard otherContacts" style="background-color: #5DE2E7;">${remainingAssignees}+</div>`;
    }

    return taskAssignee;
}


/**
 * Shows the task overlay with detailed task information.
 * @async
 * @param {string} taskTitle - The title of the task.
 * @param {string} taskDescription - The description of the task.
 * @param {string} taskDueDate - The due date of the task.
 * @param {string} taskPriority - The priority of the task.
 * @param {Array} taskAssignees - The array of task assignees.
 * @param {string} taskType - The type/category of the task.
 * @param {string} subtaskHTML - The HTML content for subtasks.
 * @param {string} id - The ID of the task.
 * @param {string} editSubtask - The HTML content for editing subtasks.
 */
async function showOverlay1(taskTitle, taskDescription, taskDueDate, taskPriority, taskAssignees, taskType, subtaskHTML, id, editSubtask) {
    const overlay = document.getElementById("overlay");
    const overlayContent = document.querySelector(".overlayContent");

    let taskPriorityIcon = getPriorityIcon(taskPriority);
    let taskTypeBackgroundColor = getTaskTypeBackgroundColor(taskType);
    let assigneeOverlayContent = getAssigneeOverlayContent(taskAssignees);

    const templateHTML = getOverlayTemplate(taskTitle,taskDescription,taskDueDate,taskPriority,taskPriorityIcon,taskType,taskTypeBackgroundColor,assigneeOverlayContent,subtaskHTML,id);

    updateOverlayContent(overlayContent, templateHTML);
    await displayOverlay(overlay, overlayContent);
    await includeHTML();
    showInitials();
}

function getTaskTypeBackgroundColor(taskType) {
    return taskType === 'User Story' ? '#1FD7C1' : '';
}

function getAssigneeOverlayContent(taskAssignees) {
    if (!Array.isArray(taskAssignees) || taskAssignees.length === 0) return '';
    
    return taskAssignees.map(assignee => {
        let contact = contacts.find(contact => contact.id === assignee.id);
        return contact ? `
            <div class="contactDiv">
                <span class="contactCard" style="background-color: ${assignee.color};"> ${assignee.initial}</span>
                <span class="contactName">${contact.name}</span>
            </div>
        ` : '';
    }).join('');
}

function updateOverlayContent(overlayContent, templateHTML) {
    overlayContent.innerHTML = templateHTML;
}

async function displayOverlay(overlay, overlayContent) {
    overlay.style.display = "flex";
    overlayContent.style.transform = "translateX(0)";
    overlayContent.style.opacity = "1";
}


/**
 * Generates the HTML for the subtasks of a task.
 * @param {Object} toDo - The task object containing subtasks and their completion status.
 * @returns {string} - HTML string representing the subtasks.
 */
function getSubtask(toDo) {
    let subtaskHTML = '';

    for (let i = 0; i < toDo.subcategory.length; i++) {
        let subtask = toDo.subcategory[i];
        let isChecked = toDo.completedSubtasks[i] === 'true' ? 'checked' : 'false';
        subtaskHTML += /*html*/ `
         <div class="checkBoxDiv">
             <input type="checkbox" id="simpleCheckbox${i}" class="checkBox" onclick="addCompletedSubtasks(${i}, '${toDo.id}')" ${isChecked}>
             <span class="checkBoxText">${subtask}</span>
         </div>
        `;
    }
    return subtaskHTML;
}

/**
 * Toggles the completion status of a subtask and updates the task.
 * @async
 * @param {number} i - The index of the subtask to toggle.
 * @param {string} id - The ID of the task.
 */
async function addCompletedSubtasks(i, id) {
    await loadDataTask();
    let taskItem = tasks.find(taskItem => taskItem.id === id);
    if (taskItem) { // Check if taskItem is not undefined
        if (taskItem.completedSubtasks[i] == 'false') {
            taskItem.completedSubtasks[i] = 'true';
        } else {
            taskItem.completedSubtasks[i] = 'false';
        }
        await changeTask(`/task/${id}/completedSubtasks`, taskItem.completedSubtasks)
        renderTasks();
    } else {
        console.error(`Task with id ${id} not found`);
    }
    renderTasks();
}

/**
 * Updates the progress bar for a task.
 * @param {number} subtasksCompleted - Number of completed subtasks.
 * @param {number} totalSubtasks - Total number of subtasks.
 * @param {number} i - Index of the task.
 */
function updateProgressBar(subtasksCompleted, totalSubtasks, i) {
    let progressPercentage = (subtasksCompleted / totalSubtasks) * 100;
    let progressBar = document.getElementById(`progressBarId${i}`);
    progressBar.style.width = progressPercentage + '%';
}

/**
 * Attaches event listeners to task cards to show an overlay when clicked.
 */
function on() {
    const overlay = document.getElementById("overlay");
    const overlayContent = document.querySelector(".overlayContent");

    const tasks = document.querySelectorAll(".card");

    tasks.forEach(task => {
        task.addEventListener("click", () => {
            overlay.style.display = "flex";
            overlayContent.style.transform = "translateX(0)";
            overlayContent.style.opacity = "1";
        });
    });
}

/**
 * Clears the content of all overlay containers that have an ID containing 'edit-task-overlay'.
 */
function clearEditTaskOverlayContent() {
    
    const overlayContainers = document.querySelectorAll('[id*="edit-task-overlay"]');

    overlayContainers.forEach(container => {
        
        container.innerHTML = '';
    });
}

/**
 * Hides the overlay by applying fade-out and slide-out animations.
 */
function off() {
    const overlay = document.getElementById("overlay");
    const overlayContent = document.querySelector(".overlayContent");
    clearEditTaskOverlayContent()

    const handleAnimationEnd = () => {
        overlay.style.display = "none";
        overlay.classList.remove("fade-out-overlay");
        overlayContent.classList.remove("slide-out-content");
        overlay.removeEventListener('animationend', handleAnimationEnd);
        overlayContent.removeEventListener('animationend', handleAnimationEnd);
    };

    overlay.addEventListener('animationend', handleAnimationEnd);
    overlayContent.addEventListener('animationend', handleAnimationEnd);

    overlayContent.classList.add("slide-out-content");
    overlay.classList.add("fade-out-overlay");
    subcategoriesChoosed = [];
    choosedContacts = [];
}

/**
 * Displays the add task overlay and initializes it.
 * @async
 * @param {string} [status='toDo'] - The status to set for the task (default is 'toDo').
 */
async function showOverlay(status = 'toDo') {

    await addTaskInit();
    addTaskOverlay.style.display = 'block';
    document.getElementById('addTaskOverlay').dataset.status = status;

}

/**
 * Hides the add task overlay with fade-out and slide-out animations.
 */
function offAddTask() {
    const overlay = document.getElementById("addTaskOverlay");
    const overlayContent = document.querySelector(".overlayContentAddTask");

    overlayContent.classList.add("slide-out-content"); // Add the slide-out animation class
    overlay.classList.add("fade-out-overlay"); // Add the fade-out animation class

    // Wait for the animation to finish before hiding the overlay
    overlay.addEventListener("animationend", function () {
        overlay.style.display = "none"; // Hide the overlay
        overlay.classList.remove("fade-out-overlay"); // Remove the fade-out animation class
        overlayContent.classList.remove("slide-out-content"); // Remove the slide-out animation class
    }, { once: true }); // Ensure the event listener is only triggered once
}



/**
 * Searches for tasks based on the input from the search field and filters them in the UI.
 * Removes existing no-results messages and updates the display of task cards based on the search input.
 * If the search input is empty, it checks for empty task sections.
 */
function searchTasks() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const taskCards = document.querySelectorAll('.card');
    const containers = getContainers();
    
    removeExistingNoResultsMessages();
    removeNoTasksMessages();

    const matchesFound = { toDo: false, progress: false, feedback: false, done: false };
    taskCards.forEach(card => updateCardDisplay(card, searchInput, matchesFound));

    Object.keys(matchesFound).forEach(key => {
        if (!matchesFound[key]) addNoResultsMessage(containers[key]);
    });

    if (!searchInput) {
        removeExistingNoResultsMessages(); 
        checkIfEmpty(); 
    }
}

/**
 * Retrieves the task containers for each section of tasks.
 * @returns {Object} An object containing the task containers for each section.
 */
function getContainers() {
    return {
        toDo: document.getElementById('toDo'),
        progress: document.getElementById('progress'),
        feedback: document.getElementById('feedback'),
        done: document.getElementById('done')
    };
}

/**
 * Updates the display of a task card based on the search input.
 * Hides or shows the card and updates the matchesFound object based on whether the card's title or description matches the input.
 * @param {HTMLElement} card - The task card element to be updated.
 * @param {string} input - The search input used for filtering.
 * @param {Object} matches - An object tracking which sections have matches.
 */
function updateCardDisplay(card, input, matches) {
    const title = card.querySelector('.cardTitle').textContent.toLowerCase();
    const description = card.querySelector('.cardContext').textContent.toLowerCase();
    const parentSection = card.closest('#toDo, #progress, #feedback, #done');
    
    if (title.includes(input) || description.includes(input)) {
        card.style.display = 'block'; 
        if (parentSection) matches[parentSection.id] = true;
    } else {
        card.style.display = 'none'; 
    }
}


/**
 * Entfernt alle existierenden "noTasks"-Nachrichten aus den Task-Containern.
 */
function removeNoTasksMessages() {
    document.querySelectorAll('.noTasks').forEach(message => message.remove());
}

/**
 * Entfernt alle existierenden "no results"-Nachrichten aus den Task-Containern.
 */
function removeExistingNoResultsMessages() {
    document.querySelectorAll('.no-results-message').forEach(message => message.remove());
}

/**
 * Fügt eine "no results"-Nachricht zu einem bestimmten Container hinzu, wenn keine passenden Aufgaben gefunden wurden.
 * @param {HTMLElement} container - Das Container-Element, zu dem die Nachricht hinzugefügt wird.
 */
function addNoResultsMessage(container) {
    if (container) {
        let noResultsMessage = document.createElement('div');
        noResultsMessage.classList.add('no-results-message');
        noResultsMessage.textContent = 'No matching tasks found';
        container.appendChild(noResultsMessage);
    }
}

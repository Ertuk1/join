async function initBoard() {
    await loadDataTask();
    await loadDataContacts();
    await includeHTML();
    checkIfEmpty();
    renderTasks();
    showInitials();
}

let currentDraggedElement = null;

function stopPropagation(event) {
    event.stopPropagation();
}

function startDragging(taskId) {
    currentDraggedElement = taskId;
}

function allowDrop(event) {
    event.preventDefault();
}

async function drop(event) {
    event.preventDefault(); // Prevent default drop behavior

    let dropZone = event.target.closest('.taskContent'); // Identify the drop zone
    if (!dropZone) return;

    let taskElement = document.querySelector(`[data-id="${currentDraggedElement}"]`);
    if (!taskElement) {
        console.error('Task element not found with id:', currentDraggedElement);
        return;
    }

    // Append the task to the drop zone
    dropZone.appendChild(taskElement);

    // Update the task's status based on the drop zone ID
    let newStatus = dropZone.id;
    let task = tasks.find(t => t.id === currentDraggedElement);

    if (task) {
        task.status = newStatus;
        await changeTask(`/task/${currentDraggedElement}/status`, task.status);
        await loadDataTask(); // Reload tasks from backend
        renderTasks(); // Re-render tasks to reflect changes
    } else {
        console.error('Task data not found for id:', currentDraggedElement);
    }
}

function renderTasks() {
    let taskToDo = document.getElementById('toDo');
    let taskInProgress = document.getElementById('progress');
    let taskFeedback = document.getElementById('feedback');
    let taskDone = document.getElementById('done');

    // Clear all columns
    taskToDo.innerHTML = '';
    taskInProgress.innerHTML = '';
    taskFeedback.innerHTML = '';
    taskDone.innerHTML = '';

    tasks.forEach((toDo, i) => {
        let id = toDo.id;
        let subtaskHTML = getSubtask(toDo);
        let editSubtask = getEditSubtaskHTML(toDo.subcategory);
        let completedSubtasks = toDo.completedSubtasks.filter(completed => completed === 'true').length;

        let taskAssignee = '';
        if (Array.isArray(toDo.assignedTo) && toDo.assignedTo.length > 0) {
            let visibleAssignees = toDo.assignedTo.slice(0, 3);
            taskAssignee = visibleAssignees.map((assignee, index) => {
                let contact = contacts.find(contact => contact.id === assignee.id);
                return contact ? `<div class="contactCard" style="background-color: ${assignee.color};">${assignee.initial}</div>` : '';
            }).join('');

            let remainingAssignees = toDo.assignedTo.length - visibleAssignees.length;
            if (remainingAssignees > 0) {
                taskAssignee += `
                <div class="contactCard otherContacts" style="background-color: #5DE2E7;">
                    ${remainingAssignees}+
                </div>`;
            }
        }

        let taskType = toDo.category;
        let taskPriorityIcon = getPriorityIcon(toDo.prio);
        let taskTypeBackgroundColor = taskType === 'User Story' ? '#1FD7C1' : '';

        // Generate the task card using the template function
        let newTask = document.createElement('div');
        newTask.innerHTML = getTaskTemplate(toDo, i, taskTypeBackgroundColor, taskType, taskAssignee, taskPriorityIcon, completedSubtasks, editSubtask, id, subtaskHTML);

        newTask.addEventListener('click', function (event) {
            event.stopPropagation();
            showOverlay1(toDo.title, toDo.description, toDo.date, toDo.prio, toDo.assignedTo, toDo.category, subtaskHTML, id, editSubtask);
        });

        // Append the task to the appropriate column based on its status
        switch (toDo.status) {
            case 'toDo':
                taskToDo.appendChild(newTask);
                break;
            case 'progress':
                taskInProgress.appendChild(newTask);
                break;
            case 'feedback':
                taskFeedback.appendChild(newTask);
                break;
            case 'done':
                taskDone.appendChild(newTask);
                break;
            default:
                taskToDo.appendChild(newTask); // Default fallback
                break;
        }

        updateProgressBar(completedSubtasks, toDo.subcategory.length, i);
    });

    checkIfEmpty(); // Ensure columns display empty messages if needed
}


async function showOverlay1(taskTitle, taskDescription, taskDueDate, taskPriority, taskAssignees, taskType, subtaskHTML, id, editSubtask) {
    const overlay = document.getElementById("overlay");
    const overlayContent = document.querySelector(".overlayContent");

    let taskPriorityIcon = getPriorityIcon(taskPriority);
    let taskTypeBackgroundColor = taskType === 'User Story' ? '#1FD7C1' : '';
    let assigneeOverlayContent = Array.isArray(taskAssignees) && taskAssignees.length > 0
        ? taskAssignees.map(assignee => {
            let contact = contacts.find(contact => contact.id === assignee.id);
            return contact ? `
                <div class="contactDiv">
                    <span class="contactCard" style="background-color: ${assignee.color};"> ${assignee.initial}</span>
                    <span class="contactName">${contact.name}</span>
                </div>
            ` : '';
        }).join('')
        : '';

    // Use the template function to get the HTML string
    const templateHTML = getOverlayTemplate(
        taskTitle, 
        taskDescription, 
        taskDueDate, 
        taskPriority, 
        taskPriorityIcon, 
        taskType, 
        taskTypeBackgroundColor, 
        assigneeOverlayContent, 
        subtaskHTML, 
        id
    );

    // Insert the generated HTML into the overlay content
    overlayContent.innerHTML = templateHTML;

    overlay.style.display = "flex";
    overlayContent.style.transform = "translateX(0)";
    overlayContent.style.opacity = "1";
    await includeHTML();
    showInitials();
}


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

function updateProgressBar(subtasksCompleted, totalSubtasks, i) {
    let progressPercentage = (subtasksCompleted / totalSubtasks) * 100;
    let progressBar = document.getElementById(`progressBarId${i}`);
    progressBar.style.width = progressPercentage + '%';
}

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

function clearEditTaskOverlayContent() {
    // Wähle alle Elemente aus, deren ID 'edit-task-overlay' enthält
    const overlayContainers = document.querySelectorAll('[id*="edit-task-overlay"]');
    
    overlayContainers.forEach(container => {
        // Leere den gesamten Inhalt jedes ausgewählten Containers
        container.innerHTML = '';
    });
}


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
}

async function showOverlay(status = 'toDo') {
    
    await addTaskInit();
    addTaskOverlay.style.display = 'block';
    document.getElementById('addTaskOverlay').dataset.status = status;
  
}

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

function getPriorityIcon(priority) {
    switch (priority) {
        case 'urgent':
            return './assets/img/urgent.png';
        case 'medium':
            return './assets/img/medium.png';
        case 'low':
            return './assets/img/low.png';
        default:
            return ''; // or return a default icon path
    }
}

async function ShowEditOverlay(id) {
    // Load the tasks from the backend
    await loadDataTask();

    // Find the specific task by its ID
    const task = tasks.find(task => task.id === id);

    if (task) {
        const { title, description, date, prio, subcategory } = task;
        subcategoriesChoosed = [...subcategory];

        await addTaskInit();
        document.getElementById(`edit-task-overlay${id}`).classList.remove('d-none');
        document.getElementById(`edit-main-input-container${id}`).classList.remove('main-input-container');
        document.getElementById(`edit-main-input-container${id}`).classList.add('edit-main-input-container');
        document.getElementById('input-border-container').classList.add('d-none');
        document.getElementById('at-alert-description').classList.add('d-none');
        document.getElementById('at-btn-container').classList.add('d-none');
        document.getElementById('category-headline').classList.add('d-none');
        document.getElementById('category-input').classList.add('d-none');
        document.getElementById('at-subcategory-open').classList.add('d-none');
        document.getElementById('editDiv').classList.add('d-none');
        var element = document.querySelector('.right-left-container');
        element.style.display = 'block';

        // Remove all elements with the specified classes
        const elementsToRemove = document.querySelectorAll('.contactOverlay, .contactDiv, .subtaskOverlay, .checkBoxDiv, .subtasksOverlay');
        elementsToRemove.forEach(element => {
            element.remove(); // Removes the element from the DOM
        });

        const saveButton = document.querySelector('.board-task-edit-btn');
        saveButton.addEventListener('click', () => saveTaskChanges(id));

        // Generate the subtask HTML if the task has subcategories
        const subtaskHTML = Array.isArray(subcategory) ? getEditSubtaskHTML(subcategory) : '';

        renderEditTaskData(id, title, description, date, prio, subtaskHTML);
    } else {
        console.error('Task not found');
    }
}



function renderEditTaskData(id, taskTitle, taskDescription, taskDueDate, taskPriority, subtaskHTML) {
    document.getElementById('task-title').value = taskTitle;
    document.getElementById('at-description').value = taskDescription;
    document.getElementById('task-due-date').value = taskDueDate;

    // Assign the generated HTML or an empty string if there are no subtasks
    document.getElementById('added-subcategories').innerHTML = subtaskHTML;

    // Set the priority icon
    const priorityIcon = getPriorityIcon(taskPriority);
    const priorityIconElement = document.getElementById('priority-icon');

    if (priorityIconElement && priorityIcon) {
        priorityIconElement.src = priorityIcon;
    }

    // Ensure correct rendering before setting priority background
    requestAnimationFrame(() => {
        setBackgroundColorPrio(taskPriority);
    });
}

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
    return 'low'; // Default-Wert, falls keine Priorität gefunden wird
}

function searchTasks() {
    let searchInput = document.getElementById('searchInput').value.toLowerCase();
    let taskCards = document.querySelectorAll('.card');

    taskCards.forEach(card => {
        let taskTitle = card.querySelector('.cardTitle').textContent.toLowerCase();
        let taskDescription = card.querySelector('.cardContext').textContent.toLowerCase();

        if (taskTitle.includes(searchInput) || taskDescription.includes(searchInput)) {
            card.style.display = 'block'; // Zeige die Karte an, wenn sie mit der Suche übereinstimmt
        } else {
            card.style.display = 'none'; // Verstecke die Karte, wenn sie nicht mit der Suche übereinstimmt
        }
    });
}
async function initBoard() {
    await loadDataTask();
    await loadDataContacts();
    await includeHTML();
    checkIfEmpty();
    //updateProgressBar(1, 2, 'progressBar1');
    renderTasks();
}

function stopPropagation(event) {
    event.stopPropagation();
}

function renderTasks() {
    let taskToDo = document.getElementById('toDo');
    taskToDo.innerHTML = '';

    for (let i = 0; i < task.length; i++) {
        let toDo = task[i];
        let id = task[i].id; 
        let subtask = getSubtask(toDo);
        let completedSubtasks = toDo.completedSubtasks.filter(completed => completed === 'true').length;
        let taskAssignee = Array.isArray(toDo.assignedTo) && toDo.assignedTo.length > 0
            ? toDo.assignedTo.map((assignee, index) => {
                let contact = contacts[index];
                return contact ? `<div class="contactCard" style="background-color: ${assignee.color};">${contact.initials}</div>` : '';
            }).join('')
            : '';
        let taskType = toDo.category
        let taskPriorityIcon = getPriorityIcon(toDo.prio);
        let taskTypeBackgroundColor  = taskType === 'User Story' ? '#1FD7C1' : '';
        let newTask = document.createElement('div');
        newTask.classList.add('card');
        newTask.setAttribute('draggable', 'true');
        newTask.setAttribute('data-index', i);
        newTask.innerHTML = `
            <div class="cardContent">
                <span class="labelUser" style="background-color: ${taskTypeBackgroundColor};">${taskType}</span>
                <div class="contextContent">
                    <span class="cardTitle">${toDo.title}</span>
                    <div>
                        <span class="cardContext">${toDo.description}</span>
                    </div>
                    <div class="progressbar">
                        <div class="progressbarContainer">
                            <div class="bar" id="progressBarId${i}"></div>
                        </div>
                        <div class="subtasks">${completedSubtasks}/${toDo.subcategory.length} Subtasks</div>
                    </div>
                    <div class="contactContainer">
                        <div style="display: flex;">
                            ${taskAssignee}
                        </div>
                        <div>
                            <img class="urgentSymbol" src="${taskPriorityIcon}" alt="${toDo.priority}">
                        </div>
                    </div>
                </div>
            </div>
        `;

        newTask.addEventListener('click', function (event) {
            event.stopPropagation();
            showOverlay1(toDo.title, toDo.description, toDo.date, toDo.prio, toDo.assignedTo, toDo.category, subtask, id);;
        });

        taskToDo.appendChild(newTask);
        updateProgressBar(completedSubtasks, toDo.subcategory.length, i); 
    }
   
}

async function showOverlay1(taskTitle, taskDescription, taskDueDate, taskPriority, taskAssignees, taskType, subtaskHTML, id) {
    const overlay = document.getElementById("overlay");
    const overlayContent = document.querySelector(".overlayContent");
    let taskPriorityIcon = getPriorityIcon(taskPriority);
    let taskTypeBackgroundColor  = taskType === 'User Story' ? '#1FD7C1' : '';
    let assigneeOverlayContent = Array.isArray(taskAssignees) && taskAssignees.length > 0
        ? taskAssignees.map((assignee, index) => {
            let contact = contacts[index];
            return contact ? `
        <div class="contactDiv">
            <span class="contactCard" style="background-color: ${assignee.color};"> ${contact.initials}</span>
            <span class="contactName">${contact.name}</span>
        </div>
        ` : '';
        }).join('')
        : '';

    overlayContent.innerHTML = /*html*/`
    <section id="edit-task-overlay${id}" class="edit-task-overlay d-none">
    <section class="edit-close-btn-container">
            <img class="closeButton" onclick="off()" src="./assets/img/Close.png" alt="">
        </section>
            <form id="edit-main-input-container${id}" class="main-input-container" w3-include-html="template/addTaskTemplate.html"></form>
            <div class="edit-btn-position-container">
                <div onclick="addTask()" class="board-task-edit-btn">
                    <div>Ok</div><img src="assets/img/check(ok).png">
                </div>
            </div>
        </div>
        </section>
        <section class="overlayUserTitle">
            <span style="background-color: ${taskTypeBackgroundColor};" class="overlayUser">${taskType}</span>
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
            <span class="dueDate">Priority:</span>
            <span class="urgencyText">${taskPriority}
                <img class="overlayUrgencyImg" src="${taskPriorityIcon}" alt="${taskPriority}">
            </span>
        </section>
        <section>
            <span class="contactOverlay">Assigned To:</span>
                ${assigneeOverlayContent}
        <div class="subtasksOverlay"><span>Subtasks</span></div>
        ${subtaskHTML}
        <section>
            <div class="editDiv">
                <div class="deleteDiv" onclick="deleteTask('${id}'); off();"><img class="deletePng" src="./assets/img/delete (1).png" alt=""><span>Delete</span></div>
                <div class="vector"></div>
                <div class="deleteDiv" onclick="ShowEditOverlay('${id}')"><img class="deletePng" src="./assets/img/edit (1).png" alt=""><span>Edit</span></div>
            </div>
        </section>
    `;

    overlay.style.display = "flex";
    overlayContent.style.transform = "translateX(0)";
    overlayContent.style.opacity = "1";
    await includeHTML();
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
    let taskItem = task.find(taskItem => taskItem.id === id);
    if (taskItem.completedSubtasks[i] == 'false') {
        taskItem.completedSubtasks[i] = 'true';
    }
    else {
        taskItem.completedSubtasks[i] = 'false';
    }
    await changeTask(`/task/${id}/completedSubtasks`, taskItem.completedSubtasks)
    renderTasks();
}


function checkIfEmpty() {
    let toDo = document.getElementById('toDo');
    let progress = document.getElementById('progress');
    let feedback = document.getElementById('feedback');
    let done = document.getElementById('done');

    if (progress.innerHTML.trim() === "") {
        progress.innerHTML = `<div class="noTasks"><span class="noTaskText">Nothing in progress</span></div>`;
    }
    if (toDo.innerHTML.trim() === "") {
        toDo.innerHTML = `<div class="noTasks"><span class="noTaskText">No tasks To do</span></div>`;
    }
    if (feedback.innerHTML.trim() === "") {
        feedback.innerHTML = `<div class="noTasks"><span class="noTaskText">No tasks awaiting feedback</span></div>`;
    }
    if (done.innerHTML.trim() === "") {
        done.innerHTML = `<div class="noTasks"><span class="noTaskText">No tasks done</span></div>`;
    }
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

function off() {
    console.log('Closing modal');
    const overlay = document.getElementById("overlay");
    const overlayContent = document.querySelector(".overlayContent");

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
}

async function showOverlay() {
    await addTaskInit();
    addTaskOverlay.style.display = 'block';
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

function ShowEditOverlay(id) {
    document.getElementById(`edit-task-overlay${id}`).classList.remove('d-none');
    document.getElementById(`edit-main-input-container${id}`).classList.remove('main-input-container');
    document.getElementById(`edit-main-input-container${id}`).classList.add('edit-main-input-container');
    document.getElementById('input-border-container').classList.add('d-none');
    document.getElementById('at-alert-description').classList.add('d-none');
    document.getElementById('at-btn-container').classList.add('d-none');
    document.getElementById('category-headline').classList.add('d-none');
    document.getElementById('category-input').classList.add('d-none');
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

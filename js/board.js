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
        let initial = getAssignedToContact(i);
        let taskAssignee = Array.isArray(toDo.assignees) ? toDo.assignees.map(assignee => `<div class="contactCard" style="background-color: rgb(232, 58, 133);">${assignee}</div>`).join('') : '';
        let taskType = toDo.category === 'user-story' ? 'User Story' : 'Technical Task';
        let taskPriorityIcon = getPriorityIcon(toDo.priority);

        let newTask = document.createElement('div');
        newTask.classList.add('card');
        newTask.setAttribute('draggable', 'true');
        newTask.setAttribute('data-index', i);
        newTask.innerHTML = `
            <div class="cardContent">
                <span class="labelUser">${taskType}</span>
                <div class="contextContent">
                    <span class="cardTitle">${toDo.title}</span>
                    <div>
                        <span class="cardContext">${toDo.description}</span>
                    </div>
                    <div class="progressbar">
                        <div class="progressbarContainer">
                            <div class="bar" id="progressBar1"></div>
                        </div>
                        <div class="subtasks">0/0 Subtasks</div>
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

        newTask.addEventListener('click', function(event) {
            event.stopPropagation();
            showOverlay1(toDo.title, toDo.description, toDo.dueDate, toDo.priority, toDo.assignees, toDo.category);
        });

        taskToDo.appendChild(newTask);
    }
}

function showOverlay1(taskTitle, taskDescription, taskDueDate, taskPriority, taskAssignees, taskType) {
    const overlay = document.getElementById("overlay");
    const overlayContent = document.querySelector(".overlayContent");

    taskAssignees = taskAssignees || [];

    overlayContent.innerHTML = `
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
            ${taskAssignees.map(assignee => `
                <div class="contactDiv">
                    <span class="contactCard" style="background-color: rgb(232, 58, 133);">${assignee.name}</span>
                </div>
            `).join('')}
        </section>
        <div class="subtasksOverlay"><span>Subtasks</span></div>
        <div class="checkBoxDiv"><input type="checkbox" id="simpleCheckbox" class="checkBox"> <span class="checkBoxText">Implement Recipe Recommendation</span></div>
        <div class="checkBoxDiv"><input type="checkbox" id="simpleCheckbox" class="checkBox"> <span class="checkBoxText">Start Page Layout</span></div>
        <section>
            <div class="editDiv">
                <div class="deleteDiv"><img class="deletePng" src="./assets/img/delete (1).png" alt=""><span>Delete</span></div>
                <div class="vector"></div>
                <div class="deleteDiv"><img class="deletePng" src="./assets/img/edit (1).png" alt=""><span>Edit</span></div>
            </div>
        </section>
    `;

    overlay.style.display = "flex";
    overlayContent.style.transform = "translateX(0)";
    overlayContent.style.opacity = "1";
}

function getAssignedToContact(i) {
    let contactHTML = '';
    for (let y = 0; y < task[i].assignedTo.length; y++) {
        let contact = task[i].assignedTo[y].initial;
        contactHTML += `<div>${contact}</div>`
    }
    return contactHTML;
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

/*function updateProgressBar(subtasksCompleted, totalSubtasks, progressBarId) {
    let progressPercentage = (subtasksCompleted / totalSubtasks) * 100;
    let progressBar = document.getElementById(progressBarId);
    progressBar.style.width = progressPercentage + '%';
}*/

function on() {
    const overlay = document.getElementById("overlay");
    const overlayContent = document.querySelector(".overlayContent");

    // Get all task elements, including the hard-coded ones
    const tasks = document.querySelectorAll(".card");

    // Add a click event listener to each task element
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
    }
}
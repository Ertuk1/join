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

function renderTasks(){
    let taskToDo = document.getElementById('toDo');
    taskToDo.innerHTML = '';
    for (let i = 0; i < task.length; i++) {
        let toDo = task[i];
        let initial = getAssignedToContact(i);
        taskToDo.innerHTML += /*html*/`
            <div class="cardContent">
                <span class="labelUser">${toDo.category}</span>
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
                            ${initial}
                        </div>
                        <div>
                            <img class="urgentSymbol" src="" alt="">
                        </div>
                    </div>
                </div>
            </div>
        `
    }}

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

document.addEventListener('DOMContentLoaded', () => {
    const overlay = document.getElementById("overlay");
    const overlayContent = document.querySelector(".overlayContent");
    const addTaskButton = document.querySelector('.addTaskButton');
    const plussButtons = document.querySelectorAll('.plussButton');
    const addTaskOverlay = document.getElementById('addTaskOverlay');

    function showOverlay() {
        addTaskOverlay.style.display = 'block';
        
        showAvailableContacts();
        showCategoryList();
    }

    function hideOverlay(event) {
        if (event.target === addTaskOverlay) {
            addTaskOverlay.style.display = 'none';
        }
    }

    addTaskButton.addEventListener('click', showOverlay);

    plussButtons.forEach(button => {
        button.addEventListener('click', showOverlay);
    });
 
    addTaskOverlay.addEventListener('click', hideOverlay);


});

function offAddTask() {
    const overlay = document.getElementById("addTaskOverlay");
    const overlayContent = document.querySelector(".overlayContentAddTask");

    overlayContent.classList.add("slide-out-content"); // Add the slide-out animation class
    overlay.classList.add("fade-out-overlay"); // Add the fade-out animation class

    // Wait for the animation to finish before hiding the overlay
    overlay.addEventListener("animationend", function() {
        overlay.style.display = "none"; // Hide the overlay
        overlay.classList.remove("fade-out-overlay"); // Remove the fade-out animation class
        overlayContent.classList.remove("slide-out-content"); // Remove the slide-out animation class
    }, { once: true }); // Ensure the event listener is only triggered once
}

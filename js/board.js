async function initBoard() {
    await loadDataTask();
    await loadDataContacts();
    await includeHTML();
    checkIfEmpty();
    updateProgressBar(1, 2, 'progressBar1');
}

function stopPropagation(event) {
    event.stopPropagation();
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

function updateProgressBar(subtasksCompleted, totalSubtasks, progressBarId) {
    let progressPercentage = (subtasksCompleted / totalSubtasks) * 100;
    let progressBar = document.getElementById(progressBarId);
    progressBar.style.width = progressPercentage + '%';
}

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

    function showOverlay(event) {
        event.stopPropagation();
        addTaskOverlay.style.display = 'block';
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


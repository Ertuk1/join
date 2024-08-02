async function initBoard() {
    await includeHTML();
    checkIfEmpty();
    updateProgressBar(1, 2, 'progressBar1');
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
    document.getElementById("overlay").style.display = "flex";
    const overlayContent = document.querySelector(".overlayContent");
    overlayContent.style.transform = "translateX(0)";
    overlayContent.style.opacity = "1";
  }

  function off() {
    const overlay = document.getElementById("overlay");
    const overlayContent = document.querySelector(".overlayContent");
    
    overlayContent.classList.add("slide-out-content"); // Add the slide-out animation class
    overlay.classList.add("fade-out-overlay"); // Add the fade-out animation class
    
    // Wait for the animation to finish before hiding the overlay
    overlay.addEventListener("animationend", function() {
        overlay.style.display = "none"; // Hide the overlay
        overlay.classList.remove("fade-out-overlay"); // Remove the fade-out animation class
        overlayContent.classList.remove("slide-out-content"); // Remove the slide-out animation class
    }, { once: true }); // Ensure the event listener is only triggered once
}

  function stopPropagation(event) {
    event.stopPropagation();
}

document.addEventListener('DOMContentLoaded', () => {
    const addTaskButton = document.querySelector('.addTaskButton');
    const plussButtons = document.querySelectorAll('.plussButton');
    const addTaskOverlay = document.getElementById('addTaskOverlay');
    const closeButton = addTaskOverlay.querySelector('.closeButton');
    const overlayContent = addTaskOverlay.querySelector('.overlayContent');

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

    closeButton.addEventListener('click', (event) => {
        event.stopPropagation();
        addTaskOverlay.style.display = 'none';
    });

    // Ensure clicking outside the overlay content hides the overlay
    addTaskOverlay.addEventListener('click', hideOverlay);


});
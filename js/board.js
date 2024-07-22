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
        progress.innerHTML = /*html*/`<div class="noTasks"><span class="noTaskText">Nothing in progress</span></div>`;
    }
    if (toDo.innerHTML.trim() === "") {
        toDo.innerHTML = /*html*/`<div class="noTasks"><span class="noTaskText">No tasks To do</span></div>`;
    }
    if (feedback.innerHTML.trim() === "") {
        feedback.innerHTML = /*html*/`<div class="noTasks"><span class="noTaskText">No tasks awaiting feedback</span></div>`;
    }
    if (done.innerHTML.trim() === "") {
        done.innerHTML = /*html*/`<div class="noTasks"><span class="noTaskText">No tasks done</span></div>`;
    }
}

function updateProgressBar(subtasksCompleted, totalSubtasks, progressBarId) {
    let progressPercentage = (subtasksCompleted / totalSubtasks) * 100;
    let progressBar = document.getElementById(progressBarId);
    progressBar.style.width = progressPercentage + '%';
}
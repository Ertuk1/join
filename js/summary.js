let newUser = JSON.parse(sessionStorage.getItem('currentUser'));

async function summeryInit() {
    await includeHTML();
    await loadDataTask();
    showInitials();
    updateGreeting();
    userName();
    updateSummary();
}

function redirectToBoard() {
    window.location.href = "board.html";
  }

function updateGreeting() {
  let greetingText = document.getElementById('greetingText');
  let currentHour = new Date().getHours();

  if (currentHour < 12) {
    greetingText.textContent = 'Good Morning,';
  } else if (currentHour < 18) {
    greetingText.textContent = 'Good Afternoon,';
  } else {
    greetingText.textContent = 'Good Evening,';
  }
}

function userName() {
  let userNameContainer = document.getElementById('userName');
  let currentUser = newUser.name;

  userNameContainer.innerHTML = /*html*/`
    ${currentUser}
  `
}

function updateSummary() {
  const tasksInBoard = tasks.length;
  const tasksInProgress = tasks.filter(task => task.status === 'progress').length;
  const awaitingFeedback = tasks.filter(task => task.status === 'feedback').length;
  const urgent = tasks.filter(task => task.prio === 'urgent').length;
  const urgentTasks = tasks.filter(task => task.prio === 'urgent');
  const sortedUrgentTasks = urgentTasks.sort((a, b) => new Date(a.date) - new Date(b.date));
  const upcomingDeadline = sortedUrgentTasks.length > 0 ? formatDate(sortedUrgentTasks[0].date) : 'No urgent tasks';
  const done = tasks.filter(task => task.status === 'done').length;
  const toDo = tasks.filter(task => task.status === 'toDo').length;

  document.getElementById('tasksInBoard').textContent = tasksInBoard;
  document.getElementById('tasksInProgress').textContent = tasksInProgress;
  document.getElementById('awaitingFeedback').textContent = awaitingFeedback;
  document.getElementById('urgent').textContent = urgent;
  document.getElementById('upcomingDeadline').textContent = upcomingDeadline;
  document.getElementById('done').textContent = done;
  document.getElementById('toDo').textContent = toDo;
}

function formatDate(dateString) {
  const date = new Date(dateString);
  const options = { month: 'long', day: 'numeric', year: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}


  
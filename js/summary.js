let newUser = JSON.parse(sessionStorage.getItem('currentUser'));

async function summeryInit() {
    await includeHTML();
    showInitials();
    updateGreeting();
    userName();
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

  
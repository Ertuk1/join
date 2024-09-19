/**
 * Parses the current user data from the session storage.
 * @type {Object}
 */
let newUser = JSON.parse(sessionStorage.getItem('currentUser'));

/**
 * Initializes the summary section by including HTML, loading data, and updating the UI.
 * @async
 * @function summeryInit
 */
async function summeryInit() {
  await includeHTML();
  await loadDataTask();
  await loadDataContacts();
  showInitials();
  updateGreeting();
  userName();
  updateSummary();
  checkResposive();
}

/**
 * Redirects the user to the board page with an optional section ID.
 * @function redirectToBoard
 * @param {string} [sectionId] - The ID of the section to navigate to.
 */
function redirectToBoard(sectionId) {
  if (sectionId) {
    window.location.href = `board.html#${sectionId}`;
  } else {
    window.location.href = "board.html";
  }
}

/**
 * Updates the greeting text based on the current time of day.
 * @function updateGreeting
 */
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

/**
 * Updates the user name display with the current user's name.
 * @function userName
 */
function userName() {
  let userNameContainer = document.getElementById('userName');
  let currentUser = newUser.name;
  userNameContainer.innerHTML = `${currentUser}`;
}

/**
 * Updates the summary section with task statistics.
 * @function updateSummary
 */
function updateSummary() {
  let tasksInBoard = tasks.length;
  let tasksInProgress = tasks.filter(task => task.status === 'progress').length;
  let awaitingFeedback = tasks.filter(task => task.status === 'feedback').length;
  let urgent = tasks.filter(task => task.prio === 'urgent').length;
  let urgentTasks = tasks.filter(task => task.prio === 'urgent');
  let sortedUrgentTasks = urgentTasks.sort((a, b) => new Date(a.date) - new Date(b.date));
  let upcomingDeadline = sortedUrgentTasks.length > 0 ? formatDate(sortedUrgentTasks[0].date) : 'No urgent tasks';
  let done = tasks.filter(task => task.status === 'done').length;
  let toDo = tasks.filter(task => task.status === 'toDo').length;

  document.getElementById('tasksInBoard').textContent = tasksInBoard;
  document.getElementById('tasksInProgress').textContent = tasksInProgress;
  document.getElementById('awaitingFeedback').textContent = awaitingFeedback;
  document.getElementById('urgent').textContent = urgent;
  document.getElementById('upcomingDeadline').textContent = upcomingDeadline;
  document.getElementById('done').textContent = done;
  document.getElementById('toDo').textContent = toDo;
}

/**
 * Formats a date string into a readable format.
 * @function formatDate
 * @param {string} dateString - The date string to format.
 * @returns {string} The formatted date string.
 */
function formatDate(dateString) {
  let date = new Date(dateString);
  let options = { month: 'long', day: 'numeric', year: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}

/**
 * Checks the responsive layout and adjusts the greeting animation accordingly.
 * @function checkResposive
 */
function checkResposive() {
  let mediaQuery = window.matchMedia("(max-width: 980px)");
  let previousPath = document.referrer;
  let background = document.querySelector(".animatedImageContainer");
  let animatedImage = document.querySelector(".greetingContainer");

  if (mediaQuery.matches && previousPath.includes('index.html')) {
    greetingAnimation(background, animatedImage, mediaQuery);
  } else if (mediaQuery.matches) {
    background.style.display = 'none';
    animatedImage.style.display = 'none';
  } else {
    background.style.display = 'none';
    animatedImage.style.display = 'flex';
  }
}

/**
 * Handles the greeting animation based on the media query.
 * @function greetingAnimation
 * @param {HTMLElement} background - The background element.
 * @param {HTMLElement} animatedImage - The animated image element.
 * @param {MediaQueryList} mediaQuery - The media query object.
 */
function greetingAnimation(background, animatedImage, mediaQuery) {
  if (mediaQuery) {
    startAnimation(background, animatedImage);
  } else {
    hideElements(background, animatedImage);
  }
}

/**
 * Starts the greeting animation by fading out the elements.
 * @function startAnimation
 * @param {HTMLElement} background - The background element.
 * @param {HTMLElement} animatedImage - The animated image element.
 */
function startAnimation(background, animatedImage) {
  background.classList.add("fadeOut");
  animatedImage.classList.add("fadeOut");
  setTimeout(function () {
    hideElements(background, animatedImage);
  }, 1500);
}

/**
 * Hides the background and animated image elements.
 * @function hideElements
 * @param {HTMLElement} background - The background element.
 * @param {HTMLElement} animatedImage - The animated image element.
 */
function hideElements(background, animatedImage) {
  background.style.display = 'none';
  animatedImage.style.display = 'none';
}

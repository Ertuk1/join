/**
 * A boolean flag to keep track of whether the checkbox is checked or not.
 * @type {boolean}
 */
let isChecked = false;

/**
 * An object representing a guest user.
 * @type {Object}
 * @property {string} name - The name of the guest user.
 * @property {string} email - The email address of the guest user.
 */
let guest = {
  name: "Guest",
  email: "guest@gmail.com",
};

/**
 * Initializes the login process by starting the join image animation,
 * loading user data, loading data contacts, getting the saved user,
 * adding hover effect for login, and checking input fields.
 */
async function logInInit() {
  joinImgAnimation();
  await loadUserData();
  await loadDataContacts();
  getSavedUser();
  addHoverForLogin();
  checkInputs();
}

/**
 * Redirects the user to the signup page.
 */
function redirectToSignup() {
  window.location.href = "signUp.html";
}

/**
 * Starts the logo animation.
 */
function joinImgAnimation() {
  let background = document.querySelector(".animatedImageContainer");
  let animatedImage = document.querySelector(".animatedImage");
  let responsiveImg = document.querySelector(".animatedImageResposive");
  let joinIcon = document.querySelector(".joinIcon");
  let mediaQuery = window.matchMedia("(max-width: 730px)");

  setTimeout(function () {
    startAnimation(background, animatedImage, joinIcon, responsiveImg, mediaQuery);
  }, 300);
}

/**
 * Starts the animation based on the media query.
 * @param {HTMLElement} background - The background element.
 * @param {HTMLElement} animatedImage - The animated image element.
 * @param {HTMLElement} joinIcon - The join icon element.
 * @param {HTMLElement} responsiveImg - The responsive image element.
 * @param {MediaQueryList} mediaQuery - The media query object.
 */
function startAnimation(background, animatedImage, joinIcon, responsiveImg, mediaQuery) {
  if (mediaQuery.matches) {
    background.classList.add("fadeOut");
    responsiveImg.classList.add("move");
    animatedImage.classList.add("move");
  } else {
    background.classList.add("fadeOut");
    animatedImage.classList.add("moveToTopLeft");
  }

  setTimeout(function () {
    hideElements(background, animatedImage, joinIcon, responsiveImg, mediaQuery);
  }, 500);
}

/**
 * Hides the animation elements based on the media query.
 * @param {HTMLElement} background - The background element.
 * @param {HTMLElement} animatedImage - The animated image element.
 * @param {HTMLElement} joinIcon - The join icon element.
 * @param {HTMLElement} responsiveImg - The responsive image element.
 * @param {MediaQueryList} mediaQuery - The media query object.
 */
function hideElements(background, animatedImage, joinIcon, responsiveImg, mediaQuery) {
  if (mediaQuery.matches) {
    responsiveImg.classList.add("hideElements");
    background.classList.add("hideElements");
  }

  background.classList.add("hideElements");
  animatedImage.classList.add("hideElements");
  joinIcon.classList.remove("hideElements");
}

/**
 * Checks the input fields and adds or removes the "logInValid" class
 * to the login button based on whether the input fields are filled or not.
 */
function checkInputs() {
  let logInButton = document.getElementById("logIn");
  let emailInput = document.getElementById("logInEmailInput");
  let passwordInput = document.getElementById("logInPasswordInput");

  if (emailInput.value.trim() !== "" && passwordInput.value.trim() !== "") {
    logInButton.classList.add("logInValid");
  } else {
    logInButton.classList.remove("logInValid");
  }
}

/**
 * Adds an event listener to the email and password input fields
 * to check the input fields when the user types in them.
 */
function addHoverForLogin() {
  let emailInput = document.getElementById("logInEmailInput");
  let passwordInput = document.getElementById("logInPasswordInput");

  emailInput.addEventListener("input", checkInputs);
  passwordInput.addEventListener("input", checkInputs);
}

/**
 * Finds the user based on the email and password entered in the input fields.
 * If the user is valid, it saves the user data in the session storage and redirects to the summary page.
 * If the user is invalid, it handles the invalid user case.
 * @param {Event} event - The event parameter represents the event object associated with this form submission.
 */
async function findUser(event) {
  event.preventDefault();
  let emailInput = document.getElementById("logInEmailInput");
  let passwordInput = document.getElementById("logInPasswordInput");
  let email = emailInput.value;
  let password = passwordInput.value;
  let rememberMe = isChecked;
  let user = users.find((userEmail) => userEmail.email === email);

  resetInputBorders(emailInput, passwordInput);

  if (isValidUser(user, password)) {
    sessionStorage.setItem('currentUser', JSON.stringify(user));

    if (rememberMe) {
      let userToSave = { email: user.email, password: user.password };
      sessionStorage.setItem("savedUser", JSON.stringify(userToSave));
    } else {
      sessionStorage.removeItem("savedUser");
    }

    await addNewContact(user.name, user.email);
    redirectToSummary();
  } else {
    handleInvalidUser(user, emailInput, passwordInput, password);
  }
}

/**
 * Adds a new contact to the contacts list with the user's name, email, and a random color.
 * @param {string} name - The name of the user.
 * @param {string} email - The email of the user.
 */
async function addNewContact(name, email) {
  let youName = name + ' (You)';
  const colorIndex = Math.floor(Math.random() * beautifulColors.length);
  const color = beautifulColors[colorIndex];
  const initial = extractInitials(name);

  const newContact = {
    name: youName,
    mail: email,
    phone: '',
    profileColor: color,
    initials: initial,
  };

  await postContact("/contacts", newContact);
}

/**
 * Resets the border color of the email and password input fields.
 * @param {HTMLInputElement} emailInput - The email input field.
 * @param {HTMLInputElement} passwordInput - The password input field.
 */
function resetInputBorders(emailInput, passwordInput) {
  emailInput.style.borderColor = "";
  passwordInput.style.borderColor = "";
}

/**
 * Checks if the user is valid based on the provided password.
 * @param {Object} user - The user object.
 * @param {string} password - The password entered by the user.
 * @returns {boolean} - True if the user is valid, false otherwise.
 */
function isValidUser(user, password) {
  return user && user.password === password;
}

/**
 * Redirects the user to the summary page.
 */
function redirectToSummary() {
  window.location.href = "/summary.html";
}

/**
 * Performs a guest login by setting the guest user data in the session storage
 * and redirecting to the summary page.
 */
function guestLogin() {
  let form = document.querySelector('form');
  sessionStorage.setItem('currentUser', JSON.stringify(guest));
  form.reset();
  redirectToSummary();
}

/**
 * Handles the case when the user is invalid by setting the border color of the input fields
 * and displaying an alert message.
 * @param {Object} user - The user object.
 * @param {HTMLInputElement} emailInput - The email input field.
 * @param {HTMLInputElement} passwordInput - The password input field.
 * @param {string} password - The password entered by the user.
 * @returns {boolean} - False, indicating an invalid user.
 */
function handleInvalidUser(user, emailInput, passwordInput, password) {
  let passwordAlert = document.querySelector(".passwordAlert");
  let rememberMe = document.querySelector(".rememberMe");

  let handleInvalidInput = () => {
    emailInput.style.borderColor = "#FF8190";
    passwordInput.style.borderColor = "#FF8190";
    passwordAlert.classList.remove("dNone");
    rememberMe.style.margin = "1px 42px 16px 42px";
  };

  if (!user) {
    handleInvalidInput();
  } else if (user.password !== password) {
    handleInvalidInput();
  }

  return false;
}

/**
 * Handles the visibility of the password input field by toggling the CSS classes,
 * changing the input type between "password" and "text", and updating the background image.
 */
function handlePaswordVisibility() {
  let passwordInput = document.getElementById("logInPasswordInput");

  if (passwordInput.classList.contains("passwordInputImg")) {
    passwordInput.classList.remove("passwordInputImg");
    passwordInput.classList.add("lockInputImg");
  } else if (passwordInput.classList.contains("lockInputImg")) {
    passwordInput.classList.remove("lockInputImg");
    passwordInput.classList.add("passwordInputFocus");
  } else if (passwordInput.classList.contains("passwordInputFocus")) {
    passwordInput.classList.remove("passwordInputFocus");
    passwordInput.classList.add("passwordInputVisible");
    passwordInput.type = "text";
  } else if (passwordInput.classList.contains("passwordInputVisible")) {
    passwordInput.classList.remove("passwordInputVisible");
    passwordInput.classList.add("passwordInputFocus");
    passwordInput.type = "password";
  }
}

/**
 * Handles the password input field image by toggling the CSS classes
 * when the input field loses focus (blur event).
 * @param {HTMLElement} element - The password input field element.
 */
function handlePasswordInputImg(element) {
  if (element.classList.contains("passwordInputImg")) {
    element.classList.remove("passwordInputImg");
    element.classList.add("lockInputImg");
  } else if (element.classList.contains("lockInputImg")) {
    element.classList.remove("lockInputImg");
    element.classList.add("passwordInputImg");
  } else if (element.classList.contains("passwordInputFocus")) {
    element.classList.remove("passwordInputFocus");
    element.classList.add("passwordInputImg");
    element.type = "password";
  } else if (element.classList.contains("passwordInputVisible")) {
    element.classList.remove("passwordInputVisible");
    element.classList.add("passwordInputImg");
    element.type = "password";
  }
}

/**
 * Handles the password input field image by toggling the CSS classes 
 * when the input field gains focus (focus event).
 * @param {HTMLElement} element - The password input field element.
 */
function focusPasswordInput(element) {
  if (element.classList.contains("passwordInputImg")) {
    element.classList.remove("passwordInputImg");
    element.classList.add("passwordInputFocus");
  } else if (element.classList.contains("lockInputImg")) {
    element.classList.remove("lockInputImg");
    element.classList.add("passwordInputFocus");
  } else if (element.classList.contains("passwordInputVisible")) {
    element.classList.remove("passwordInputVisible");
    element.classList.add("passwordInputFocus");
  }
}

/**
 * Toggles the checkbox and updates the isChecked variable based on the checkbox state.
 * @param {HTMLImageElement} img - The checkbox image element.
 */
function toggleCheckbox(img) {
  let checkmark = document.getElementById("checkmark");
  checkmark.classList.toggle("dNone");

  if (checkmark.classList.contains("dNone")) {
    img.src = "/assets/img/emptyCheckbox.png";
    isChecked = false;
  } else {
    img.src = "/assets/img/chackBox.png";
    isChecked = true;
  }
}

/**
 * Gets the saved user data from the session storage and populates the email and password input fields.
 */
function getSavedUser() {
  let savedUser = sessionStorage.getItem("savedUser");

  if (savedUser) {
    let user = JSON.parse(savedUser);
    document.getElementById("logInEmailInput").value = user.email;
    document.getElementById("logInPasswordInput").value = user.password;
  }
}

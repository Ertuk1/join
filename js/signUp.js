/**
 * A boolean flag to keep track of whether the checkbox is checked or not.
 * @type {boolean}
 */
let isChecked = false;

/**
 * Initializes the sign-up process by loading user data.
 * @async
 */
async function initSignUp() {
  await loadUserData();
}

/**
 * Handles the sign-up form submission and creates a new user.
 * @async
 * @param {Event} event - The form submission event.
 */
async function addUser(event) {
  event.preventDefault();

  let name = document.getElementById("signUpNameInput");
  let email = document.getElementById("signUpEmailInput");
  let password = document.getElementById("signUpPasswordInput");
  let confirmPassword = document.getElementById("confirmPasswordInput");

  resetInputBorders(name, email, password, confirmPassword);

  if (!isValidInput(name, email, password, confirmPassword)) {
    handleInvalidInput(name, email, password, confirmPassword);
    return false;
  }

  if (!isChecked) {
    document.querySelector(".acceptCheckbox").classList.add("redLine");
    document.querySelector(".signUp").style.marginTop = "0px";
    return false;
  }

  let newUser = createNewUser(name, email, password);

  try {
    await postUserData('/users', newUser);
    showSignUpPopup();
    setTimeout(hideSignUpPopupAndRedirect, 3000);
  } catch (error) {
    console.error("Fehler beim Senden der Daten:", error);
  }

  return false;
}

/**
 * Resets the border colors of the input fields and removes any error styles.
 * @param {HTMLInputElement} name - The name input field.
 * @param {HTMLInputElement} email - The email input field.
 * @param {HTMLInputElement} password - The password input field.
 * @param {HTMLInputElement} confirmPassword - The confirm password input field.
 */
function resetInputBorders(name, email, password, confirmPassword) {
  name.style.borderColor = "";
  email.style.borderColor = "";
  password.style.borderColor = "";
  confirmPassword.style.borderColor = "";
  document.querySelector(".passwordAlert").classList.add("dNone");
  document.querySelector(".acceptCheckbox").style.marginTop = "14px";
}

/**
 * Checks if the input fields are valid.
 * @param {HTMLInputElement} name - The name input field.
 * @param {HTMLInputElement} email - The email input field.
 * @param {HTMLInputElement} password - The password input field.
 * @param {HTMLInputElement} confirmPassword - The confirm password input field.
 * @returns {boolean} True if all input fields are valid, false otherwise.
 */
function isValidInput(name, email, password, confirmPassword) {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  return (
    name.value !== "" &&
    email.value !== "" &&
    passwordRegex.test(password.value) &&
    password.value === confirmPassword.value
  );
}

/**
 * Handles invalid input by setting the border colors of the input fields.
 * @param {HTMLInputElement} name - The name input field.
 * @param {HTMLInputElement} email - The email input field.
 * @param {HTMLInputElement} password - The password input field.
 * @param {HTMLInputElement} confirmPassword - The confirm password input field.
 */
function handleInvalidInput(name, email, password, confirmPassword) {
  if (name.value === "") name.style.borderColor = "#FF8190";
  if (email.value === "") email.style.borderColor = "#FF8190";
  if (password.value === "") password.style.borderColor = "#FF8190";
  if (confirmPassword.value === "") confirmPassword.style.borderColor = "#FF8190";

  if (password.value !== confirmPassword.value) {
    password.style.borderColor = "#FF8190";
    confirmPassword.style.borderColor = "#FF8190";
    document.querySelector(".passwordAlert").classList.remove("dNone");
    document.querySelector(".acceptCheckbox").style.marginTop = "0px";
  }
}

/**
 * Creates a new user object from the input field values.
 * @param {HTMLInputElement} name - The name input field.
 * @param {HTMLInputElement} email - The email input field.
 * @param {HTMLInputElement} password - The password input field.
 * @returns {Object} The new user object.
 */
function createNewUser(name, email, password) {
  return {
    name: name.value,
    email: email.value,
    password: password.value,
  };
}

/**
 * Shows the sign-up popup.
 */
function showSignUpPopup() {
  let signUpPopupContainer = getSignUpPopupContainer();
  let signUpPopup = getSignUpPopup();

  signUpPopupContainer.classList.add('show');
  signUpPopup.classList.add('moveToCenter');
}

/**
 * Hides the sign-up popup.
 */
function hideSignUpPopup() {
  let signUpPopupContainer = getSignUpPopupContainer();
  let signUpPopup = getSignUpPopup();

  signUpPopupContainer.classList.remove('show');
  signUpPopup.classList.remove('moveToCenter');
}

/**
 * Retrieves the sign-up popup container element from the DOM.
 * @returns {HTMLElement} The sign-up popup container element.
 */
function getSignUpPopupContainer() {
  let signUpPopupContainer = document.getElementById('signUpPopupContainer');
  return signUpPopupContainer;
}

/**
 * Retrieves the sign-up popup element from the DOM.
 * @returns {HTMLElement} The sign-up popup element.
 */
function getSignUpPopup() {
  let signUpPopup = document.getElementById('signUpPopup');
  return signUpPopup;
}

/**
 * Hides the sign-up popup and redirects to the login page.
 */
function hideSignUpPopupAndRedirect() {
  hideSignUpPopup();
  redirectToLogIn();
}

/**
 * Redirects to the login page.
 */
function redirectToLogIn() {
  window.location.href = "index.html";
}

/**
 * Toggles the checkbox state and updates the UI accordingly.
 * @param {HTMLImageElement} img - The checkbox image element.
 */
function toggleCheckbox(img) {
  let checkmark = document.getElementById("checkmark");
  let signUpButton = document.querySelector(".signUp");

  if (checkmark.style.display === "none") {
    checkmark.style.display = "block";
    img.src = "/assets/img/chackBox.png";
    signUpButton.classList.add("signUpHover");
    document.querySelector(".acceptCheckbox").classList.remove("redLine");
    document.querySelector(".signUp").style.marginTop = "1px";
    isChecked = true;
  } else {
    checkmark.style.display = "none";
    img.src = "/assets/img/emptyCheckbox.png";
    signUpButton.classList.remove("signUpHover");
    isChecked = false;
  }
}

/**
 * Capitalizes the first letter of the input name.
 * @param {HTMLInputElement} inputName - The input field for the name.
 */
function toUpperCase(inputName) {
  let name = inputName.value.trim();

  if (name.length > 0) {
    let firstChar = name.charAt(0).toUpperCase();
    let restOfName = name.slice(1);
    let fullName = firstChar + restOfName;
    inputName.value = fullName;
  }
}

/**
 * Handles the visibility of the password input field by toggling the CSS classes,
 * changing the input type between "password" and "text", and updating the background image.
 */
function handlePaswordVisibility() {
  let passwordInput = document.getElementById("signUpPasswordInput");

  if (passwordInput.classList.contains("passwordInputImg")) {
    passwordInput.classList.remove("passwordInputImg");
    passwordInput.classList.add("lockInputImg");
  } else if (passwordInput.classList.contains("lockInputImg")) {
    passwordInput.classList.remove("lockInputImg");
    passwordInput.classList.add("confirmPasswordInputFocus");
  } else if (passwordInput.classList.contains("confirmPasswordInputFocus")) {
    passwordInput.classList.remove("confirmPasswordInputFocus");
    passwordInput.classList.add("confirmPasswordInputVisible");
    passwordInput.type = "text";
  } else if (passwordInput.classList.contains("confirmPasswordInputVisible")) {
    passwordInput.classList.remove("confirmPasswordInputVisible");
    passwordInput.classList.add("confirmPasswordInputFocus");
    passwordInput.type = "password";
  }
}

/**
 * Handles the password input field image by toggling the CSS classes
 * when the input field loses focus (blur event).
 * @param {HTMLInputElement} element - The password input field.
 */
function handlePasswordInputImg(element) {
  if (element.classList.contains("passwordInputImg")) {
    element.classList.remove("passwordInputImg");
    element.classList.add("lockInputImg");
  } else if (element.classList.contains("lockInputImg")) {
    element.classList.remove("lockInputImg");
    element.classList.add("passwordInputImg");
  } else if (element.classList.contains("confirmPasswordInputFocus")) {
    element.classList.remove("confirmPasswordInputFocus");
    element.classList.add("passwordInputImg");
    element.type = "password";
  } else if (element.classList.contains("confirmPasswordInputVisible")) {
    element.classList.remove("confirmPasswordInputVisible");
    element.classList.add("passwordInputImg");
    element.type = "password";
  }
}

/**
 * Handles the password input field image by toggling the CSS classes 
 * when the input field gains focus (focus event).
 * @param {HTMLInputElement} element - The password input field.
 */
function focusPasswordInput(element) {
  if (element.classList.contains("passwordInputImg")) {
    element.classList.remove("passwordInputImg");
    element.classList.add("confirmPasswordInputFocus");
  } else if (element.classList.contains("lockInputImg")) {
    element.classList.remove("lockInputImg");
    element.classList.add("confirmPasswordInputFocus");
  } else if (element.classList.contains("confirmPasswordInputVisible")) {
    element.classList.remove("confirmPasswordInputVisible");
    element.classList.add("confirmPasswordInputFocus");
  }
}

/**
 * Handles the visibility of the confirm password input field by toggling the CSS classes,
 * changing the input type between "password" and "text", and updating the background image.
 */
function handleConfirmPaswordVisibility() {
  let confirmPasswordInput = document.getElementById("confirmPasswordInput");

  if (confirmPasswordInput.classList.contains("passwordInputImg")) {
    confirmPasswordInput.classList.remove("passwordInputImg");
    confirmPasswordInput.classList.add("lockInputImg");
  } else if (confirmPasswordInput.classList.contains("lockInputImg")) {
    confirmPasswordInput.classList.remove("lockInputImg");
    confirmPasswordInput.classList.add("confirmPasswordInputFocus");
  } else if (confirmPasswordInput.classList.contains("confirmPasswordInputFocus")) {
    confirmPasswordInput.classList.remove("confirmPasswordInputFocus");
    confirmPasswordInput.classList.add("confirmPasswordInputVisible");
    confirmPasswordInput.type = "text";
  } else if (confirmPasswordInput.classList.contains("confirmPasswordInputVisible")) {
    confirmPasswordInput.classList.remove("confirmPasswordInputVisible");
    confirmPasswordInput.classList.add("confirmPasswordInputFocus");
    confirmPasswordInput.type = "password";
  }
}

/**
 * Handles the confirmP password input field image by toggling the CSS classes
 * when the input field loses focus (blur event).
 * @param {HTMLInputElement} element - The confirm password input field.
 */
function handleConfirmPaswordInputImg(element) {
  if (element.classList.contains("passwordInputImg")) {
    element.classList.remove("passwordInputImg");
    element.classList.add("lockInputImg");
  } else if (element.classList.contains("lockInputImg")) {
    element.classList.remove("lockInputImg");
    element.classList.add("passwordInputImg");
  } else if (element.classList.contains("confirmPasswordInputFocus")) {
    element.classList.remove("confirmPasswordInputFocus");
    element.classList.add("passwordInputImg");
    element.type = "password";
  } else if (element.classList.contains("confirmPasswordInputVisible")) {
    element.classList.remove("confirmPasswordInputVisible");
    element.classList.add("passwordInputImg");
    element.type = "password";
  }
}

/**
 * Handles the confirm password input field image by toggling the CSS classes 
 * when the input field gains focus (focus event).
 * @param {HTMLInputElement} element - The confirm password input field.
 */
function focusConfirmPasswordInput(element) {
  if (element.classList.contains("passwordInputImg")) {
    element.classList.remove("passwordInputImg");
    element.classList.add("confirmPasswordInputFocus");
  } else if (element.classList.contains("lockInputImg")) {
    element.classList.remove("lockInputImg");
    element.classList.add("confirmPasswordInputFocus");
  } else if (element.classList.contains("confirmPasswordInputVisible")) {
    element.classList.remove("confirmPasswordInputVisible");
    element.classList.add("confirmPasswordInputFocus");
  }
}

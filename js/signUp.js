let isChecked = false;
let passwordInputClicks = 0;
let confirmPasswordInputClicks = 0;

async function initSignUp() {
  await loadUserData();
}

function getSignUpPopupContainer() {
  let signUpPopupContainer = document.getElementById('signUpPopupContainer');
  return signUpPopupContainer;
}

function getSignUpPopup() {
  let signUpPopup = document.getElementById('signUpPopup');
  return signUpPopup;
}


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
    return false;
  }

  let newUser = createNewUser(name, email, password);

  try {
    await postUserData('/users', newUser);
    showSignUpPopup();
    setTimeout(hideSignUpPopupAndRedirect, 9000);
  } catch (error) {
    console.error("Fehler beim Senden der Daten:", error);
  }

  return false;
}

function resetInputBorders(name, email, password, confirmPassword) {
  name.style.borderColor = "";
  email.style.borderColor = "";
  password.style.borderColor = "";
  confirmPassword.style.borderColor = "";
  document.querySelector(".passwordAlert").classList.add("dNone");
  document.querySelector(".acceptCheckbox").style.marginTop = "14px";
}

function isValidInput(name, email, password, confirmPassword) {
  return (
    name.value !== "" &&
    email.value !== "" &&
    password.value !== "" &&
    confirmPassword.value !== "" &&
    password.value === confirmPassword.value
  );
}

function handleInvalidInput(name, email, password, confirmPassword) {
  if (name.value === "") name.style.borderColor = "#FF8190";
  if (email.value === "") email.style.borderColor = "#FF8190";
  if (password.value === "") password.style.borderColor = "#FF8190";
  if (confirmPassword.value === "")
    confirmPassword.style.borderColor = "#FF8190";
  if (password.value !== confirmPassword.value) {
    password.style.borderColor = "#FF8190";
    confirmPassword.style.borderColor = "#FF8190";
    document.querySelector(".passwordAlert").classList.remove("dNone");
    document.querySelector(".acceptCheckbox").style.marginTop = "0px";
  }
}

function createNewUser(name, email, password) {
  return {
    name: name.value,
    email: email.value,
    password: password.value,
  };
}

function showSignUpPopup() {
  let signUpPopupContainer = getSignUpPopupContainer();
  let signUpPopup = getSignUpPopup();

  signUpPopupContainer.classList.add('show');
  signUpPopup.classList.add('moveToCenter');
}

function hideSignUpPopup() {
  let signUpPopupContainer = getSignUpPopupContainer();
  let signUpPopup = getSignUpPopup();

  signUpPopupContainer.classList.remove('show');
  signUpPopup.classList.remove('moveToCenter');
} 

function hideSignUpPopupAndRedirect() {
  hideSignUpPopup();
  redirectToLogIn();
}

function redirectToLogIn() {
  window.location.href = "index.html";
}

function toggleCheckbox(img) {
  let checkmark = document.getElementById("checkmark");
  let signUpButton = document.querySelector(".signUp");
  if (checkmark.style.display === "none") {
    checkmark.style.display = "block";
    img.src = "/assets/img/chackBox.png";
    signUpButton.classList.add("signUpHover");
    isChecked = true;
  } else {
    checkmark.style.display = "none";
    img.src = "/assets/img/emptyCheckbox.png";
    signUpButton.classList.remove("signUpHover");
    isChecked = false;
  }
}

function handlePasswordInputClick() {
  let passwordInput = document.getElementById("signUpPasswordInput");
  passwordInputClicks++;

  if (passwordInputClicks === 1) {
    passwordInput.classList.add("passwordInputFocus");
  } else if (passwordInputClicks === 2) {
    passwordInput.type = "text";
    passwordInput.classList.add("passwordInputVisible");
  } else if (passwordInputClicks === 3) {
    passwordInput.classList.remove("passwordInputFocus");
    passwordInput.classList.remove("passwordInputVisible");
    passwordInput.type = "password";
    passwordInputClicks = 0;
  }
}

function handleConfirmPasswordInputClick() {
  let confirmPasswordInput = document.getElementById("confirmPasswordInput");
  confirmPasswordInputClicks++;

  if (confirmPasswordInputClicks === 1) {
    confirmPasswordInput.classList.add("confirmPasswordInputFocus");
  } else if (confirmPasswordInputClicks === 2) {
    confirmPasswordInput.type = "text";
    confirmPasswordInput.classList.add("confirmPasswordInputVisible");
  } else if (confirmPasswordInputClicks === 3) {
    confirmPasswordInput.classList.remove("confirmPasswordInputFocus");
    confirmPasswordInput.classList.remove("confirmPasswordInputVisible");
    confirmPasswordInput.type = "password";
    confirmPasswordInputClicks = 0;
  }
}

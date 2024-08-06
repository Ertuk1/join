let users = [];
let isChecked = false;

async function initSignUp() {
  await loadUserData();
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
    return false; // Beende die Funktion, ohne Daten zu senden
  }

  let newUser = createNewUser(name, email, password);

  try {
    await postUserData("/users", newUser);
    redirectToLogIn();
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
  }
}

function createNewUser(name, email, password) {
  return {
    name: name.value,
    email: email.value,
    password: password.value,
  };
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

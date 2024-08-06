const BASE_URL =
  "https://join-323f5-default-rtdb.europe-west1.firebasedatabase.app/";
let users = [];

async function initSignUp() {
  await loadUserData();
}

async function fetchUserData(path) {
  let response = await fetch(BASE_URL + path + ".json");
  return responseToJson = await response.json();
}

async function loadUserData() {
  let userResponse = await fetchUserData("users");
  let userKeysArray = Object.keys(userResponse);

  for (let index = 0; index < userKeysArray.length; index++) {
    users.push(
      {
        id : userKeysArray[index],
        name : userResponse[userKeysArray[index]].name,
        email : userResponse[userKeysArray[index]].email,
        password : userResponse[userKeysArray[index]].password,
      }
    )
  }
  console.log(users);
  
}

async function addUser(event) {
  event.preventDefault();
  const name = document.getElementById("signUpNameInput");
  const email = document.getElementById("signUpEmailInput");
  const password = document.getElementById("signUpPasswordInput");
  const confirmPassword = document.querySelector(".confirmPasswordInput");

  resetInputBorders(name, email, password, confirmPassword);

  if (!isValidInput(name, email, password, confirmPassword)) {
    handleInvalidInput(name, email, password, confirmPassword);
    return false;
  }

  const newUser = createNewUser(name, email, password);

  try {
    await postUserData("/users", newUser);
    redirectToIndex();
  } catch (error) {
    console.error("Fehler beim Senden der Daten:", error);
    // Behandeln Sie den Fehler entsprechend
  }

  return false;
}

function resetInputBorders(name, email, password, confirmPassword) {
  name.style.borderColor = '';
  email.style.borderColor = '';
  password.style.borderColor = '';
  confirmPassword.style.borderColor = '';
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
  if (name.value === '') name.style.borderColor = 'red';
  if (email.value === '') email.style.borderColor = 'red';
  if (password.value === '') password.style.borderColor = 'red';
  if (confirmPassword.value === '') confirmPassword.style.borderColor = 'red';
  if (password.value !== confirmPassword.value) {
    password.style.borderColor = 'red';
    confirmPassword.style.borderColor = 'red';
  }
}

function createNewUser(name, email, password) {
  return {
    name: name.value,
    email: email.value,
    password: password.value,
  };
}

function redirectToIndex() {
  window.location.href = "/index.html";
}



async function postUserData(path, newUser) {
  let response = await fetch(BASE_URL + path + ".json", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newUser),
  });
  return (responseToJson = await response.json());
}

function redirectToLogIn() {
  window.location.href = "index.html";
}

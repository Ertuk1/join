const BASE_URL =
  "https://join-323f5-default-rtdb.europe-west1.firebasedatabase.app/";
let users = [];

async function initSignUp() {
  await loadData();
}

async function loadData(path = "/users") {
  let response = await fetch(BASE_URL + path + ".json");
  users = await response.json();
}

async function addUser() {
  let name = document.getElementById("signUpNameInput");
  let email = document.getElementById("signUpEmailInput");
  let password = document.getElementById("signUpPasswordInput");
  newUser = {
    name: name.value,
    email: email.value,
    password: password.value,
  };
  await postUserData("/users", newUser);
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

async function logInInit() {
  joinImgAnimation();
  await loadUserData();
}

function redirectToSignup() {
  window.location.href = "signUp.html";
}

function joinImgAnimation() {
  let animatedImageContainer = document.querySelector(".animatedImageContainer");
  let animatedImage = document.querySelector(".animatedImage");
  let joinIcon = document.querySelector(".joinIcon");

  setTimeout(function () {
    animatedImageContainer.classList.add("fadeOut");
    animatedImage.classList.add("moveToTopLeft");

    setTimeout(function () {
      animatedImageContainer.classList.add("hideElements");
      animatedImage.classList.add("hideElements");
      joinIcon.classList.remove("hideElements");
    }, 1500); 
  }, 500);
}

function findUser(event) {
  event.preventDefault();
  const emailInput = document.getElementById("logInEmailInput");
  const passwordInput = document.getElementById("logInPasswordInput");
  const email = emailInput.value;
  const password = passwordInput.value;
  const user = users.find(userEmail => userEmail.email === email);

  resetInputBorders(emailInput, passwordInput);

  if (isValidUser(user, password)) {
    redirectToSummary();
  } else {
    handleInvalidUser(user, emailInput, passwordInput, password);
  }
}

function resetInputBorders(emailInput, passwordInput) {
  emailInput.style.borderColor = '';
  passwordInput.style.borderColor = '';
}

function isValidUser(user, password) {
  return user && user.password === password;
}

function redirectToSummary() {
  window.location.href = "/summary.html";
}

function handleInvalidUser(user, emailInput, passwordInput, password) {
  if (!user) {
    emailInput.style.borderColor = 'red';
  }

  if (user && user.password !== password) {
    passwordInput.style.borderColor = 'red';
  }

  return false;
}





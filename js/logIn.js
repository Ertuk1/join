let passwordInputClicks = 0;
let isChecked = false;


async function logInInit() {
  joinImgAnimation();
  await loadUserData();
  getSavedUser();
  addHoverForLogin();
}


function redirectToSignup() {
  window.location.href = "signUp.html";
}


function joinImgAnimation() {
  let animatedImageContainer = document.querySelector(".animatedImageContainer");
  let animatedImage = document.querySelector(".animatedImage");
  let joinIcon = document.querySelector(".joinIcon");

  const hasVisitedBefore = localStorage.getItem("hasVisitedBefore");

  if (!hasVisitedBefore) {
    startAnimation(animatedImageContainer, animatedImage, joinIcon);
  } else {
    hideElements(animatedImageContainer, animatedImage, joinIcon);
  }
}


function startAnimation(animatedImageContainer, animatedImage, joinIcon) {
  setTimeout(function () {
    animatedImageContainer.classList.add("fadeOut");
    animatedImage.classList.add("moveToTopLeft");

    setTimeout(function () {
      hideElements(animatedImageContainer, animatedImage, joinIcon);
      localStorage.setItem("hasVisitedBefore", true);
    }, 1500);
  }, 500);
}


function hideElements(animatedImageContainer, animatedImage, joinIcon) {
  animatedImageContainer.classList.add("hideElements");
  animatedImage.classList.add("hideElements");
  joinIcon.classList.remove("hideElements");
}


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


function addHoverForLogin() {
  let emailInput = document.getElementById("logInEmailInput");
  let passwordInput = document.getElementById("logInPasswordInput");
  emailInput.addEventListener("input", checkInputs);
  passwordInput.addEventListener("input", checkInputs);
}


function findUser(event) {
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
      localStorage.setItem("savedUser", JSON.stringify(userToSave));
    } else {
      localStorage.removeItem("savedUser");
    }

    redirectToSummary();
  } else {
    handleInvalidUser(user, emailInput, passwordInput, password);
  }
}


function resetInputBorders(emailInput, passwordInput) {
  emailInput.style.borderColor = "";
  passwordInput.style.borderColor = "";
}


function isValidUser(user, password) {
  return user && user.password === password;
}


function redirectToSummary() {
  window.location.href = "/summary.html";
}


function handleInvalidUser(user, emailInput, passwordInput, password) {
  if (!user) {
    emailInput.style.borderColor = "#FF8190";
    passwordInput.style.borderColor = "#FF8190";
    document.querySelector(".rememberMe").style.margin = "9px 42px 24px 42px";
    document.querySelector(".passwordAlert").classList.remove("dNone");
  }

  if (user.password !== password) {
    emailInput.style.borderColor = "#FF8190";
    passwordInput.style.borderColor = "#FF8190";
    document.querySelector(".passwordAlert").classList.remove("dNone");
    document.querySelector(".rememberMe").style.margin = "9px 42px 24px 42px";
  }

  return false;
}


function handlePasswordInputClick() {
  let passwordInput = document.getElementById("logInPasswordInput");
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


function getSavedUser() {
  let savedUser = localStorage.getItem("savedUser");
  if (savedUser) {
    const user = JSON.parse(savedUser);
    document.getElementById("logInEmailInput").value = user.email;
    document.getElementById("logInPasswordInput").value = user.password;
  }
}


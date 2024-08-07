let passwordInputClicks = 0;
let isChecked = false;

async function logInInit() {
  joinImgAnimation();
  await loadUserData();
  getSavedUser();
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
  const rememberMe = isChecked;

  const user = users.find(userEmail => userEmail.email === email);

  resetInputBorders(emailInput, passwordInput);

  if (isValidUser(user, password)) {
    if (rememberMe) {
      const userToSave = { email: user.email, password: user.password };
      localStorage.setItem('savedUser', JSON.stringify(userToSave));
    } else {
      localStorage.removeItem('savedUser');
    }

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
    emailInput.style.borderColor = '#FF8190';
    passwordInput.style.borderColor = '#FF8190';
    document.querySelector(".passwordAlert").classList.remove("dNone");
    document.querySelector(".rememberMe").style.margin = "9px 42px 24px 42px";
  }

  if (user && user.password !== password) {
    emailInput.style.borderColor = '#FF8190';
    passwordInput.style.borderColor = '#FF8190';
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
  const savedUser = localStorage.getItem('savedUser');
  if (savedUser) {
    const user = JSON.parse(savedUser);
    document.getElementById('logInEmailInput').value = user.email;
    document.getElementById('logInPasswordInput').value = user.password;
  }
}



let isChecked = false;
let guest = { name: "Guest",
              email: "guest@gmail.com",
};


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
  let background = document.querySelector(".animatedImageContainer");
  let animatedImage = document.querySelector(".animatedImage");
  let responsiveImg = document.querySelector(".animatedImageResposive");
  let joinIcon = document.querySelector(".joinIcon");
  let signup = document.getElementById('resposivSignup');
  let hasVisitedBefore = localStorage.getItem("hasVisitedBefore");
  let mediaQuery = window.matchMedia("(max-width: 730px)");

  if (hasVisitedBefore) {
      startAnimation(background, animatedImage, joinIcon, signup, responsiveImg, mediaQuery);
  } else {
    hideElements(background, animatedImage, joinIcon, signup, responsiveImg, mediaQuery);
  }
}


function startAnimation(background, animatedImage, joinIcon, signup, responsiveImg, mediaQuery) {
  if (mediaQuery.matches) {
    signup.classList.add("marginTop");
    signup.classList.remove("resposivSignup");
    background.classList.add("fadeOut");
    responsiveImg.classList.add("move");
    animatedImage.classList.add("move");
  } else {
    background.classList.add("fadeOut");
    animatedImage.classList.add("moveToTopLeft");
  }

    setTimeout(function () {
      hideElements(background, animatedImage, joinIcon, signup, responsiveImg, mediaQuery);
      localStorage.setItem("hasVisitedBefore", true);
    }, 500);
}

function hideElements(background, animatedImage, joinIcon, signup, responsiveImg, mediaQuery) {
  if (mediaQuery.matches)  {
    signup.classList.remove("marginTop");
    signup.classList.add("resposivSignup");
    responsiveImg.classList.add("hideElements");
    background.classList.add("hideElements");
  }
  background.classList.add("hideElements");
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
      localStorage.setItem("savedUser", JSON.stringify(userToSave));
    } else {
      localStorage.removeItem("savedUser");
    }
    await addNewContact(user.name, user.email);
    redirectToSummary();
  } else {
    handleInvalidUser(user, emailInput, passwordInput, password);
  }
}

async function addNewContact(name, email) {
  let youName = name + ' (You)';
  const colorIndex = Math.floor(Math.random() * beautifulColors.length); // Zufälliger Index für Farbe
  const color = beautifulColors[colorIndex];
  const initial = extractInitials(name); // Annahme: extractInitials ist bereits implementiert
  const newContact = {
      name: youName,
      mail: email,
      phone: '', // Da wir keine Telefonnummer während der Registrierung erhalten
      profileColor: color,
      initials: initial,
  };

  await postContact("/contacts", newContact);
  console.log('Neuer Kontakt hinzugefügt:', newContact);
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

function guestLogin() {
  sessionStorage.setItem('currentUser', JSON.stringify(guest));
  redirectToSummary();
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


function handlepaswordImg(element) {
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


function handlepaswordStyle(element) {
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


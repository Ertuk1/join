function logInInit() {
  joinImgAnimation();
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



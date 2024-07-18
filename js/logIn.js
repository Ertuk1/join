function logInInit() {
  joinImgAnimation();
}

function redirectToSignup() {
  window.location.href = "signUp.html";
}

function joinImgAnimation() {
    const animatedImageContainer = document.querySelector(".animatedImageContainer");
    const animatedImage = document.querySelector(".animatedImage");

    setTimeout(function () {
        animatedImageContainer.classList.add("fadeOut");
        animatedImage.classList.add("fadeOut");
        animatedImage.classList.add("moveToTopLeft");
      }, 2000);
}


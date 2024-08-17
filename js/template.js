let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));

async function initTemplate() {
    await includeHTML();
    showInitials();
}

async function includeHTML() {
    let includeElements = document.querySelectorAll('[w3-include-html]');
    for (let i = 0; i < includeElements.length; i++) {
        const element = includeElements[i];
        file = element.getAttribute("w3-include-html");
        let resp = await fetch(file);
        if (resp.ok) {
            element.innerHTML = await resp.text();
        } else {
            element.innerHTML = 'Page not found';
        }
    }
    currentPage();
}


function goBack() {
  window.history.back();
}

function toggleSubMenu() {
  let element = document.getElementById('subMenu');
  element.classList.toggle('open');
}

function currentPage() {
    let cP = window.location.href;

    if (cP.includes('summary.html')) {
        document.getElementById('summaryMenu').classList.add('currentPage');
    }
    else if (cP.includes('addTask.html')) {
        document.getElementById('addTaskMenu').classList.add('currentPage');
    }
    else if (cP.includes('board.html')) {
        document.getElementById('boardMenu').classList.add('currentPage');
    } 
    else if(cP.includes('contacts.html')) {
        document.getElementById('contactsMenu').classList.add('currentPage');
    }
    else if (cP.includes('legalNotice.html')){
        document.getElementById('legalNoticeMenu').classList.add('currentPagePolicy');
    }
    else if(cP.includes('privacyPolicy.html')){
        document.getElementById('privacyPolicyMenu').classList.add('currentPagePolicy');
    }
    else if(cP.includes('legalNoticeNoLogin.html')){
        document.getElementById('legalNoticeNoLoginMenu').classList.add('currentPagePolicy');
    }
    else if(cP.includes('privacyPolicyNoLogin.html')){
        document.getElementById('privacyPolicyNoLoginMenu').classList.add('currentPagePolicy');
    }
    }

function showInitials() {
  let userIcon = document.getElementById('userIcon');

  if (currentUser && typeof currentUser === 'object') {
    if (userIcon) {
      let userName = currentUser.name;
      let nameArray = userName.split(' ');
      let initials = '';

      if (nameArray.length > 0) {
        initials = `${nameArray[0].charAt(0)}${nameArray[nameArray.length - 1].charAt(nameArray[Array.length - 1].length - 1)}`;
      }

      userIcon.innerHTML = `<div>${initials}</div>`;
    } 
  } 
}

function clearSessionStorage() {
  sessionStorage.clear();
}
  
function logout() {
  clearSessionStorage();
  window.location.href = "/index.html";
}





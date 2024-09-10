let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));

async function initTemplate() {
    await includeHTML();
    await loadDataContacts();
    showInitials();
}

async function includeHTML() {
    let includeElements = document.querySelectorAll('[w3-include-html]');
    for (let i = 0; i < includeElements.length; i++) {
        let element = includeElements[i];
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
  let pageMap = {
    'summary.html': 'summaryMenu',
    'addTask.html': 'addTaskMenu',
    'board.html': ['boardMenu', 'boardMenuResposive'],
    'contacts.html': 'contactsMenu',
    'legalNotice.html': 'legalNoticeMenu',
    'privacyPolicy.html': 'privacyPolicyMenu',
    'legalNoticeNoLogin.html': 'legalNoticeNoLoginMenu',
    'privacyPolicyNoLogin.html': 'privacyPolicyNoLoginMenu'
  };

  let currentPageName = window.location.href.split('/').pop();

  let targetIds = pageMap[currentPageName];
  if (targetIds) {
    let targetElements = Array.isArray(targetIds) ? targetIds : [targetIds];
    targetElements.forEach(id => {
      let element = document.getElementById(id);
      if (element) {
        element.classList.add('currentPage');
      }
    });
  }
}


function showInitials() {
  let userIcon = document.getElementById('userIcon');

  if (currentUser && typeof currentUser === 'object' && currentUser.name) {
    if (userIcon) {
      let userName = currentUser.name;
      let nameArray = userName.split(' ');
      let initials = '';

      if (nameArray.length > 0) {
        initials = `${nameArray[0].charAt(0).toUpperCase()}`;

        if (nameArray.length > 1) {
          initials += `${nameArray[nameArray.length - 1].charAt(0).toUpperCase()}`;
        }
      }

      userIcon.innerHTML = `<div>${initials}</div>`;
    }
  }
}


function clearStorage() {
  sessionStorage.removeItem("currentUser");
}

async function logout() {
  for (let i = 0; i < contacts.length; i++){
      let contact = contacts[i];
      if (contact.name.endsWith("(You)")) {
      await deleteDataContact(`/contacts/${contact.id}`);
   } 
  }
   clearStorage();
   window.location.href = "/index.html";
}





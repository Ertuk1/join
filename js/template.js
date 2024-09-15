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

function getTaskTemplate(toDo, i, taskTypeBackgroundColor, taskType, taskAssignee, taskPriorityIcon, completedSubtasks, editSubtask, id, subtaskHTML) {
  return `
      <div class="card" draggable="true" ondragstart="startDragging('${id}')" data-id="${id}">
          <div class="cardContent">
              <span class="labelUser" style="background-color: ${taskTypeBackgroundColor};">${taskType}</span>
              <div class="contextContent">
                  <span class="cardTitle">${toDo.title}</span>
                  <div>
                      <span class="cardContext">${toDo.description}</span>
                  </div>
                  <div class="progressbar">
                      <div class="progressbarContainer">
                          <div class="bar" id="progressBarId${i}"></div>
                      </div>
                      <div class="subtasks">${completedSubtasks}/${toDo.subcategory.length} Subtasks</div>
                  </div>
                  <div class="contactContainer">
                      <div style="display: flex;">
                          ${taskAssignee}
                      </div>
                      <div>
                          <img class="urgentSymbol" src="${taskPriorityIcon}" alt="${toDo.prio}">
                      </div>
                  </div>
              </div>
          </div>
      </div>`;
}

function getEditSubtaskHTML(editSubtask) {
  let subtaskHTML = ''
  for (let i = 0; i < editSubtask.length; i++) {
      let choosedSubcategorie = editSubtask[i];
      subtaskHTML += /*html*/`
  <div class="choosed-subcategorie-container">
      <input class="choosed-subcategory-input" value="${choosedSubcategorie}" id="choosed-subcategory-${i}">
      <div class="choosed-subcategorie-btn-container">
          <img onclick="focusInput('choosed-subcategory-${i}')" class="at-choosed-subcategory-edit" src="assets/img/editDark.png" id="at-choosed-subcategory-edit-${i}">
          <div class="small-border-container"></div>
          <img onclick="removeSubcategory(${i})" class="at-choosed-subcategory-delete" src="assets/img/delete.png" id="at-choosed-subcategory-delete-${i}">
      </div>
      <div class="choosed-subcategorie-btn-container-active-field">
          <img onclick="removeSubcategory(${i})" class="at-choosed-subcategory-delete" src="assets/img/delete.png" id="at-choosed-subcategory-delete-active-${i}">
          <div class="small-border-container-gray"></div>
          <img class="at-choosed-subcategory-check" src="assets/img/checkOkDarrk.png" id="at-choosed-subcategory-check-active-${i}">
      </div>
  </div>`
  }
  return subtaskHTML
}

function checkIfEmpty() {
  let toDo = document.getElementById('toDo');
  let progress = document.getElementById('progress');
  let feedback = document.getElementById('feedback');
  let done = document.getElementById('done');

  if (progress.innerHTML.trim() === "") {
      progress.innerHTML = `<div class="noTasks"><span class="noTaskText">Nothing in progress</span></div>`;
  }
  if (toDo.innerHTML.trim() === "") {
      toDo.innerHTML = `<div class="noTasks"><span class="noTaskText">No tasks To do</span></div>`;
  }
  if (feedback.innerHTML.trim() === "") {
      feedback.innerHTML = `<div class="noTasks"><span class="noTaskText">No tasks awaiting feedback</span></div>`;
  }
  if (done.innerHTML.trim() === "") {
      done.innerHTML = `<div class="noTasks"><span class="noTaskText">No tasks done</span></div>`;
  }
}

function generateAssignedContactsHTML(initials, contactName, id, color) {
  return `
      <div class="at-contact-layout" onclick="toggleCheckbox('${id}')">
          <div class="at-contact-name-container">
              <div class="at-contact-shortcut-layout" style="background-color: ${color};">
                  <div class="at-contact-shortcut">${initials}</div>
              </div>
              <div class="at-contact-name">${contactName}</div>
          </div>
          <label class="at-label-checkbox">
              <input data-contact-id="${id}" data-contact-color="${color}" data-contact-initials="${initials}" type="checkbox">
              <span class="at-checkmark"></span>
          </label>
      </div>`;
}

function getContactViewTemplate(contact, i) {
  return `
      <div class="profileName">
          <div class="profilePictureContact" id="pictureViewContact" style="background-color: ${contact.profileColor}">${contact.initials}</div>
          <div class="nameEditBox">
              <div class="nameBox">
                  <h2>${contact.name}</h2>
              </div>
              <div class="editDivContact">
                  <div class="editBox" id="editDiv" onclick="showEditContact(${i})"><img src="assets/img/edit_contact.png" alt="edit">
                      <p>Edit</p>
                  </div>
                  <div class="editBox" id="deleteDiv" onclick="deleteContact('/contacts/${contact.id}')"><img src="assets/img/delete_contact.png" alt="">
                      <p>Delete</p>
                  </div>
              </div>
          </div>
      </div>
      <div class="contactInformation">
          <p>Contact Information</p>
      </div>
      <div>
          <div class="showOneContact">
              <div class="showOneContactInfo">
                  <h3>Email</h3>
                  <a id="emailFromContact" href="mailto:${contact.mail}">${contact.mail}</a>
              </div>
              <div class="showOneContactInfo">
                  <h3>Phone</h3>
                  <p id="phoneFromContact">${contact.phone}</p>
              </div>
          </div>
      </div>
  `;
}

function getResponsiveContactTemplate(contact, i) {
  return `
      <div onclick="closeEditDiv()">
          <div class="profileName">
              <div class="profilePictureContact" id="pictureViewContact" style="background-color: ${contact.profileColor}">${contact.initials}</div>
              <div class="nameEditBox">
                  <div class="nameBox">
                      <h2>${contact.name}</h2>
                  </div>
                  <div class="editDivContact">
                      <div class="editBox" id="editDiv" onclick="showEditContact(${i})"><img src="assets/img/edit_contact.png" alt="edit">
                          <p>Edit</p>
                      </div>
                      <div class="editBox" id="deleteDiv" onclick="deleteContact('/contacts/${contact.id}')"><img src="assets/img/delete_contact.png" alt="">
                          <p>Delete</p>
                      </div>
                  </div>
              </div>
          </div>
          <div class="contactInformation">
              <p>Contact Information</p>
          </div>
          <div class="showOneContact" onclick="closeEditDiv()">
              <div class="showOneContactInfo">
                  <h3>Email</h3>
                  <a id="emailFromContact" href="mailto:${contact.mail}">${contact.mail}</a>
              </div>
              <div class="showOneContactInfo">
                  <h3>Phone</h3>
                  <p id="phoneFromContact">${contact.phone}</p>
              </div>
          </div>
          <div onclick="event.stopPropagation(), showEditDiv(${i})" id="editContactThirdSection"><img src="./assets/img/points_white.png" alt=""></div>
          <div id="editDivResp" onclick="event.stopPropagation()">
              <div id="editContactResp" onclick="event.stopPropagation(event), showEditContact(${i})"><img src="./assets/img/edit_contact.png" alt=""><p>Edit</p></div>
              <div id="deleteContactResp" onclick="event.stopPropagation(event), deleteContact('/contacts/${contact.id}'), closeEditResponsive()"><img src="./assets/img/delete_contact.png" alt=""><p>Delete</p></div>
          </div>
      </div>
  `;
}

function getEditContactTemplate(contact, i) {
  return `
      <div id="closeAddContactDiv"><img onclick="cancelEditContact()" id="addNewContactCloseButton" src="/assets/img/Close.png" alt="close"></div>
      <div class="profileDivContact">
          <div id="editProfilePicture">
              <div id="whiteCircle">
                  <div id="initialsEditContact">
                      <h1 id="initialsText"></h1>
                  </div>
              </div>
          </div>
          <div id="contactInput">
              <div id="inputDiv">
                  <div id="inputBox" class="inputBox"><input class="inputBlueBorder" id="editName" required type="text" placeholder="Name">
                      <img src="/assets/img/person.png">
                  </div>
                  <div class="inputBox"><input id="editEmail" type="email" required placeholder="Email">
                      <img src="/assets/img/mail.png">
                  </div>
                  <div class="inputBox"><input id="editPhone" type="number" pattern="[0-9]" placeholder="Phone"> 
                      <img src="/assets/img/call.png">
                  </div>
              </div>
              <div id="addNewContactAlert"></div>
              <div id="btnDiv">
                  <button onclick="cancelEditContact(); deleteDataContact('/contacts/${contact.id}')" id="cancelButtonContact">Delete<img id="cancelIcon" src="./assets/img/cancel(x).png" alt=""></button>
                  <button onclick="editContactToArray(${i}), deleteDataContact('/contacts/${contact.id}')" id="editContactButton">Save<img src="./assets/img/check.png" alt=""></button>
              </div>
          </div>
      </div>
  `;
}

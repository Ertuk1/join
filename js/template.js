/**
 * Parses the current user data from the session storage.
 * @type {Object}
 */
let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));

/**
 * Initializes the template by including HTML and loading data.
 * @async
 * @function initTemplate
 */
async function initTemplate() {
    await includeHTML();
    await loadDataContacts();
    showInitials();
}

/**
 * Includes HTML files into the current document.
 * @async
 * @function includeHTML
 */
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

/**
 * Navigates back to the previous page in the browser history.
 * @function goBack
 */
function goBack() {
  window.history.back();
}

/**
 * Toggles the visibility of the sub-menu.
 * @function toggleSubMenu
 */
function toggleSubMenu() {
  let element = document.getElementById('subMenu');
  element.classList.toggle('open');
}

/**
 * Highlights the current page in the navigation menu.
 * @function currentPage
 */
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

/**
 * Displays the user's initials in the user icon(Top-right corner).
 * @function showInitials
 */
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

/**
 * Clears the current user data from the session storage.
 * @function clearStorage
 */
function clearStorage() {
  sessionStorage.removeItem("currentUser");
}

/**
 * Logs out the user by deleting their contact data and redirecting to the index page.
 * @async
 * @function logout
 */
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

/**
 * Generates the HTML template for a task card.
 * @function getTaskTemplate
 * @param {Object} toDo - The task object.
 * @param {number} i - The index of the task.
 * @param {string} taskTypeBackgroundColor - The background color for the task type label.
 * @param {string} taskType - The task type.
 * @param {string} taskAssignee - The HTML for the assigned contacts.
 * @param {string} taskPriorityIcon - The URL of the priority icon.
 * @param {string} completedSubtasks - The number of completed subtasks.
 * @param {Array} editSubtask - The array of subtasks.
 * @param {string} id - The ID of the task.
 * @param {string} subtaskHTML - The HTML for the subtasks.
 * @returns {string} The HTML template for the task card.
 */
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

/**
 * Generates the HTML for the subtask inputs.
 * @function getEditSubtaskHTML
 * @param {Array} editSubtask - The array of subtasks.
 * @returns {string} The HTML for the subtask inputs.
 */
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

/**
 * Checks if any task section is empty and displays a "No tasks" message.
 * @function checkIfEmpty
 */
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

/**
 * Generates the HTML for an assigned contact.
 * @function generateAssignedContactsHTML
 * @param {string} initials - The initials of the contact.
 * @param {string} contactName - The name of the contact.
 * @param {string} id - The ID of the contact.
 * @param {string} color - The color of the contact's profile picture.
 * @returns {string} The HTML for the assigned contact.
 */
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

/**
 * Generates the HTML template for a contact view.
 * @function getContactViewTemplate
 * @param {Object} contact - The contact object.
 * @param {number} i - The index of the contact.
 * @returns {string} The HTML template for the contact view.
 */
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

/**
 * Generates the HTML template for a responsive contact view.
 * @function getResponsiveContactTemplate
 * @param {Object} contact - The contact object.
 * @param {number} i - The index of the contact.
 * @returns {string} The HTML template for the responsive contact view.
 */
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

/**
 * Generates the HTML template for editing a contact.
 * @function getEditContactTemplate
 * @param {Object} contact - The contact object.
 * @param {number} i - The index of the contact.
 * @returns {string} The HTML template for editing a contact.
 */
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
              <div id="addNewContactAlertedit"></div>
              <div id="btnDiv">
                  <button onclick="cancelEditContact(); deleteDataContact('/contacts/${contact.id}')" id="cancelButtonContact">Delete<img id="cancelIcon" src="./assets/img/cancel(x).png" alt=""></button>
                  <button onclick="editContactToArray(${i}), deleteDataContact('/contacts/${contact.id}')" id="editContactButton">Save<img src="./assets/img/check.png" alt=""></button>
              </div>
          </div>
      </div>
  `;
}

/**
 * Generates the HTML template for the task overlay.
 * @function getOverlayTemplate
 * @param {string} taskTitle - The title of the task.
 * @param {string} taskDescription - The description of the task.
 * @param {string} taskDueDate - The due date of the task.
 * @param {string} taskPriority - The priority of the task.
 * @param {string} taskPriorityIcon - The URL of the priority icon.
 * @param {string} taskType - The type of the task.
 * @param {string} taskTypeBackgroundColor - The background color for the task type label.
 * @param {string} assigneeOverlayContent - The HTML for the assigned contacts.
 * @param {string} subtaskHTML - The HTML for the subtasks.
 * @param {string} id - The ID of the task.
 * @returns {string} The HTML template for the task overlay.
 */
function getOverlayTemplate(taskTitle, taskDescription, taskDueDate, taskPriority, taskPriorityIcon, taskType, taskTypeBackgroundColor, assigneeOverlayContent, subtaskHTML, id) {
  return `
      <section id="edit-task-overlay${id}" class="edit-task-overlay d-none">
          <section class="edit-close-btn-container">
              <img class="closeButton" onclick="off()" src="./assets/img/Close.png" alt="">
          </section>
          <form id="edit-main-input-container${id}" class="main-input-container" w3-include-html="template/addTaskTemplate.html"></form>
          <div class="edit-btn-position-container">
              <div onclick="addTask()" class="board-task-edit-btn">
                  <div>Ok</div><img src="assets/img/check(ok).png">
              </div>
          </div>
      </section>
      <section class="overlayUserTitle">
          <span style="background-color: ${taskTypeBackgroundColor};" class="overlayUser">${taskType}</span>
          <img class="closeButton" onclick="off()" src="./assets/img/Close.png" alt="">
      </section>
      <section>
          <span class="overlayTitle">${taskTitle}</span>
      </section>
      <section class="overlayContext"><span>${taskDescription}</span></section>
      <section class="dateDiv">
          <span class="dueDate">Due date:</span>
          <span class="date">${taskDueDate}</span>
      </section>
      <section class="prioDiv">
          <span class="dueDate">Priority:</span>
          <span class="urgencyText">${taskPriority}
              <img class="overlayUrgencyImg" src="${taskPriorityIcon}" alt="${taskPriority}">
          </span>
      </section>
      <section>
          <span class="contactOverlay">Assigned To:</span>
          ${assigneeOverlayContent}
      </section>
      <div class="subtasksOverlay"><span>Subtasks</span></div>
      ${subtaskHTML}
      <section>
          <div id="editDiv" class="editDiv">
              <div class="deleteDiv" onclick="deleteTask('${id}'); off();"><img class="deletePng" src="./assets/img/delete (1).png" alt=""><span>Delete</span></div>
              <div class="vector"></div>
              <div class="deleteDiv" onclick="ShowEditOverlay('${id}', '${taskTitle}', '${taskDescription}', '${taskDueDate}', '${taskPriority}')">
                  <img class="deletePng" src="./assets/img/edit (1).png" alt=""><span>Edit</span>
              </div>
          </div>
      </section>
  `;
}

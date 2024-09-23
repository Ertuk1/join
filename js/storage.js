/**
 * The base URL for the Firebase Realtime Database.
 * @type {string}
 */
const BASE_URL = "https://join-323f5-default-rtdb.europe-west1.firebasedatabase.app/";

/**
 * An array to store contact data.
 * @type {Array}
 */
let contacts = [];

/**
 * An array to store user data.
 * @type {Array}
 */
let users = [];

/**
 * An array to store task data.
 * @type {Array}
 */
let tasks = [];

/**
 * Adds a new task to the database.
 * @async
 * @function addTask
 */
async function addTask() {
  if (!checkRequiredInput()) {
    return;
  }
  let title = document.getElementById("task-title");
  let description = document.getElementById("at-description");
  let assignedTo =
    choosedContacts && choosedContacts.length > 0 ? choosedContacts : [];
  let date = document.getElementById("task-due-date");
  let prio = taskPrio;
  let status = document.getElementById('addTaskOverlay').dataset.status || 'toDo';

  task = {
    title: title.value,
    description: description.value,
    assignedTo: assignedTo,
    date: date.value,
    prio: prio,
    category: categoryChoosed,
    subcategory: subcategoriesChoosed,
    completedSubtasks: subtaskCompleted,
    status: status,
  };
  await postTask("/task", task);
  await addTaskInit();
  goToBoard();
}

/**
 * Adds a new task to the board.
 * @async
 * @function addTaskBoard
 */
async function addTaskBoard() {
  if (!checkRequiredInput()) {
    return;
  }
  let title = document.getElementById("task-title");
  let description = document.getElementById("at-description");
  let assignedTo =
    choosedContacts && choosedContacts.length > 0 ? choosedContacts : [];
  let date = document.getElementById("task-due-date");
  let prio = taskPrio;


  task = {
    title: title.value,
    description: description.value,
    assignedTo: assignedTo,
    date: date.value,
    prio: prio,
    category: categoryChoosed,
    subcategory: subcategoriesChoosed,
    completedSubtasks: subtaskCompleted,
    status: 'toDo',
  };
  await postTask("/task", task);
  goToBoard();
}

/**
 * Loads task data from the database.
 * @async
 * @function loadDataTask
 * @param {string} [path="/task"] - The path to fetch task data from.
 */
async function loadDataTask(path = "/task") {
  let response = await fetch(BASE_URL + path + ".json");
  let responseToJson = await response.json();

  if (responseToJson) {
      tasks = []; // Clear existing tasks
      let taskKeysArray = Object.keys(responseToJson);

      for (let i = 0; i < taskKeysArray.length; i++) {
          let taskData = responseToJson[taskKeysArray[i]];
          tasks.push({
              id: taskKeysArray[i],
              title: taskData.title,
              description: taskData.description,
              assignedTo: taskData.assignedTo || [],
              date: taskData.date,
              prio: taskData.prio,
              category: taskData.category,
              subcategory: taskData.subcategory || [],
              completedSubtasks: taskData.completedSubtasks || [],
              status: taskData.status
          });
      }
  }
}

/**
 * Posts a new task to the database.
 * @async
 * @function postTask
 * @param {string} path - The path to post the task data to.
 * @param {Object} task - The task data to be posted.
 * @returns {Promise<Object>} The response data from the server.
 */
async function postTask(path, task) {
  let response = await fetch(BASE_URL + path + ".json", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(task),
  });
  return (responseToJson = await response.json());
}

/**
 * Changes an existing task in the database.
 * @async
 * @function changeTask
 * @param {string} path - The path to update the task data.
 * @param {Object} task - The updated task data.
 * @returns {Promise<Object>} The response data from the server.
 */

async function changeTask(path, task) {
  let response = await fetch(BASE_URL + path + ".json", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(task),
  });
  return (responseToJson = await response.json());
}

/**
 * Changes an existing contact in the database.
 * @async
 * @function changeContact
 * @param {string} [path=""] - The path to update the contact data.
 * @param {Object} [data={}] - The updated contact data.
 * @returns {Promise<Object>} The response data from the server.
 */
async function changeContact(path = "", data = {}) {
  let response = await fetch(BASE_URL + path + ".json", {
    method: "PUT",
    header: {
      Contact: "application/json",
    },
    body: JSON.stringify(data),
  });
  return response.json();
}

/**
 * Posts a new contact to the database.
 * @async
 * @function postContact
 * @param {string} path - The path to post the contact data to.
 * @param {Object} newContact - The new contact data to be posted.
 * @returns {Promise<Object>} The response data from the server.
 */
async function postContact(path, newContact) {
  let response = await fetch(BASE_URL + path + ".json", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newContact),
  });
  return (responseToJson = await response.json());
}

/**
 * Updates an existing contact in the database.
 * @async
 * @function updateContact
 * @param {string} path - The path including the contact's unique ID to update the data.
 * @param {Object} updatedContact - The contact data to be updated.
 * @returns {Promise<Object>} The response data from the server.
 */
async function updateContact(path, updatedContact) {
  let response = await fetch(BASE_URL + path + ".json", {
    method: "PUT", // Use PATCH or PUT for updates
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedContact),
  });
  return await response.json();
}

/**
 * Deletes contact data from the database.
 * @async
 * @function deleteDataContact
 * @param {string} [path=""] - The path to delete the contact data from.
 * @returns {Promise<Object>} The response data from the server.
 */
async function deleteDataContact(path = "") {
  let response = await fetch(BASE_URL + path + ".json", {
      method: "DELETE",
  });
  return responseToJson = await response.json();
}

/**
 * Deletes a contact from the database and updates the UI.
 * @async
 * @function deleteContact
 * @param {string} contact - The path or identifier of the contact to be deleted.
 */
async function deleteContact(contact) {
  await deleteDataContact(contact);
  await loadDataContacts();
  renderContacts();
  document.getElementById('viewContact').innerHTML = '';
}

/**
 * Loads contact data from the database.
 * @async
 * @function loadDataContacts
 * @param {string} [path="/contacts"] - The path to fetch contact data from.
 */
async function loadDataContacts(path = "/contacts") {
  let response = await fetch(BASE_URL + path + ".json");
  responseToJson = await response.json();

  contacts = [];
  let contactsKeysArray = Object.keys(responseToJson);
  for (let i = 0; i < contactsKeysArray.length; i++) {
    contacts.push({
      id: contactsKeysArray[i],
      mail: responseToJson[contactsKeysArray[i]].mail,
      name: responseToJson[contactsKeysArray[i]].name,
      initials: responseToJson[contactsKeysArray[i]].initials,
      phone: responseToJson[contactsKeysArray[i]].phone,
      profileColor: responseToJson[contactsKeysArray[i]].profileColor,
    });
  }
}

/**
 * Fetches user data from the database.
 * @async
 * @function fetchUserData
 * @param {string} path - The path to fetch user data from.
 * @returns {Promise<Object>} The response data from the server.
 */
async function fetchUserData(path) {
  let response = await fetch(BASE_URL + path + ".json");
  return (responseToJson = await response.json());
}

/**
 * Loads user data from the database.
 * @async
 * @function loadUserData
 */
async function loadUserData() {
  let userResponse = await fetchUserData("users");
  let userKeysArray = Object.keys(userResponse);

  for (let index = 0; index < userKeysArray.length; index++) {
    users.push({
      id: userKeysArray[index],
      name: userResponse[userKeysArray[index]].name,
      email: userResponse[userKeysArray[index]].email,
      password: userResponse[userKeysArray[index]].password,
    });
  }
}

/**
 * Posts a new user to the database.
 * @async
 * @function postUserData
 * @param {string} path - The path to post the user data to.
 * @param {Object} newUser - The new user data to be posted.
 * @returns {Promise<Object>} The response data from the server.
 */
async function postUserData(path, newUser) {
  let response = await fetch(BASE_URL + path + ".json", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newUser),
  });
  return (responseToJson = await response.json());
}

/**
 * Deletes a task from the database and updates the UI.
 * @async
 * @function deleteTask
 * @param {string} id - The ID of the task to be deleted.
 */
async function deleteTask(id) {   
    await deleteDataTask(`/task/${id}`);
    await loadDataTask();
    renderTasks();
}

/**
 * Deletes task data from the database.
 * @async
 * @function deleteDataTask
 * @param {string} path - The path to delete the task data from.
 * @returns {Promise<Object>} The response data from the server.
 */
async function deleteDataTask(path) {
    let response = await fetch(BASE_URL + path + ".json", {
        method: "DELETE"
    });
    return response.json();
}

/**
 * Saves changes made to a task in the database and updates the UI.
 * @async
 * @function saveTaskChanges
 * @param {string} id - The ID of the task to be updated.
 */
async function saveTaskChanges(id) {
  await loadDataTask(); 
  const task = getTaskDetails(id);
  const updatedTask = {
    title: task.title || 'Untitled',
    description: task.description || 'No description',
    date: task.dueDate || new Date().toISOString().split('T')[0],
    prio: getTaskPriority(),
    subcategory: getSubcategories() || task.existing.subcategory,
    assignedTo: getAssignedContacts() || task.existing.assignedTo,
    status: task.existing.status, 
    category: task.existing.category,
    completedSubtasks: task.existing.completedSubtasks,
  };
  off()
  await saveUpdatedTask(id, updatedTask);
}

async function saveUpdatedTask(id, updatedTask) {
  try {
    await changeTask(`/task/${id}`, updatedTask);
    await loadDataTask();
    renderTasks();
    clearEditTaskOverlayContent();
  } catch (error) {
    console.error('Fehler beim Speichern der Änderungen:', error);
  }
}

function getTaskDetails(id) {
  const existingTask = tasks.find(task => task.id === id);
  return {
    title: document.getElementById('task-title').value.trim(),
    description: document.getElementById('at-description').value.trim(),
    dueDate: document.getElementById('task-due-date').value,
    existing: existingTask,
  };
}

function getTaskPriority() {
  const priorities = ['urgent', 'medium', 'low'];
  return priorities.find((prio) => document.querySelector(`.at-bg-${prio}`)) || 'low';
}

function getSubcategories() {
  return Array.from(document.querySelectorAll('.choosed-subcategory-input')).map(input => input.value);
}

function getAssignedContacts() {
  const assignedContacts = new Set();
  
  Array.from(document.querySelectorAll('.at-label-checkbox input[type="checkbox"]:checked')).forEach(input => {
    const contact = {
      id: input.getAttribute('data-contact-id'),
      color: input.getAttribute('data-contact-color'),
      initial: input.getAttribute('data-contact-initials'),
    };
    assignedContacts.add(JSON.stringify(contact)); // Use JSON.stringify to store as a string
  });

  return Array.from(assignedContacts).map(contact => JSON.parse(contact)); // Convert back to objects
}

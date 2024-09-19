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
  await loadDataTask(); // Call loadDataTask to populate the tasks array
  

  const taskTitle = document.getElementById('task-title').value.trim() || 'Untitled';
  const taskDescription = document.getElementById('at-description').value.trim() || 'No description';
  const taskDueDate = document.getElementById('task-due-date').value || new Date().toISOString().split('T')[0];

  // Überprüfen und setzen der Priorität
  let taskPriority;
  const urgentElement = document.querySelector('.at-bg-urgent');
  const mediumElement = document.querySelector('.at-bg-medium');
  const lowElement = document.querySelector('.at-bg-low');

  if (urgentElement) {
    taskPriority = 'urgent';
  } else if (mediumElement) {
    taskPriority = 'medium';
  } else if (lowElement) {
    taskPriority = 'low';
  } else {
    taskPriority = 'low'; // Standardwert
  }

  // Retrieve existing task data
  let existingTask;
  for (const task of tasks) {
    if (task.id === id) {
      existingTask = task;
      break;
    }
  }

  // Get the updated subcategories from the edit overlay
  const subcategories = Array.from(document.querySelectorAll('.choosed-subcategory-input')).map(input => input.value) || [];
  const assignedToContacts = Array.from(document.querySelectorAll('.at-label-checkbox input[type="checkbox"]:checked')).map(input => {
    const contactId = input.getAttribute('data-contact-id');
    const contactColor = input.getAttribute('data-contact-color');
    const contactInitials = input.getAttribute('data-contact-initials');
    return { id: contactId, color: contactColor, initial: contactInitials };
  });
  

  const updatedTask = {
    title: taskTitle,
    description: taskDescription,
    date: taskDueDate,
    prio: taskPriority,
    subcategory: subcategories.length > 0 ? subcategories : existingTask.subcategory, // Use the updated subcategories if they exist, otherwise use the existing ones
    assignedTo: assignedToContacts.length > 0 ? assignedToContacts : existingTask.assignedTo, 
    status: existingTask.status, // Use the existing status
    category: existingTask.category,
    completedSubtasks: existingTask.completedSubtasks,
  };

  

  try {
    // Überprüfen, was an das Backend gesendet wird
    await changeTask(`/task/${id}`, updatedTask);

    // Überprüfen, ob die Aufgabe nach dem Speichern korrekt neu geladen wird
    await loadDataTask();
    renderTasks();
    subcategoriesChoosed = [];
    // Schließen des Overlays
    off();
  } catch (error) {
    console.error('Fehler beim Speichern der Änderungen:', error);
  }
  clearEditTaskOverlayContent()
}
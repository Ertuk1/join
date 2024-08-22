const BASE_URL =
  "https://join-323f5-default-rtdb.europe-west1.firebasedatabase.app/";
let contacts = [];
let users = [];
let tasks = [];

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
  goToBoard();
}

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


async function deleteDataContact(path = "") {
  let response = await fetch(BASE_URL + path + ".json", {
      method: "DELETE",
  });
  return responseToJson = await response.json();
}

async function deleteContact(contact) {
  await deleteDataContact(contact);
  await loadDataContacts();
  renderContacts();
  document.getElementById('viewContact').innerHTML = '';
}

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

async function fetchUserData(path) {
  let response = await fetch(BASE_URL + path + ".json");
  return (responseToJson = await response.json());
}

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
  console.log(users);
}

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

async function deleteTask(id) {
    
    await deleteDataTask(`/task/${id}`);

    
    await loadDataTask();

    
    renderTasks();
}

async function deleteDataTask(path) {
    let response = await fetch(BASE_URL + path + ".json", {
        method: "DELETE"
    });
    return response.json();
}

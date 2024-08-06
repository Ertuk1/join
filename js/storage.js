const BASE_URL = 'https://join-323f5-default-rtdb.europe-west1.firebasedatabase.app/';
let contacts = [];

async function addTask() {
    if (!checkRequiredInput()) {
        return;
    }
    let title = document.getElementById('task-title');
    let description = document.getElementById('at-description');
    let assignedTo = choosedContacts;
    let date = document.getElementById('task-due-date');
    let prio = taskPrio;
    task = {
        'title': title.value,
        'description': description.value,
        'assignedTo': assignedTo,
        'date': date.value,
        'prio': prio,
        'category': categoryChoosed,
        'subcategory': subcategoriesChoosed
    }
    await postTask("/task", task);
    goToBoard();
}

async function loadDataTask(path = "/task") {
    let response = await fetch(BASE_URL + path + ".json");
    responseToJson = await response.json();


    task = [];
    let taskKeysArray = Object.keys(responseToJson);
    for (let i = 0; i < taskKeysArray.length; i++) {
        task.push(
            {
                id: taskKeysArray[i],
                title: responseToJson[taskKeysArray[i]].title,
                description: responseToJson[taskKeysArray[i]].description,
                assignedTo: responseToJson[taskKeysArray[i]].assignedTo,
                date: responseToJson[taskKeysArray[i]].date,
                prio: responseToJson[taskKeysArray[i]].prio,
                category: responseToJson[taskKeysArray[i]].category,
                subcategory: responseToJson[taskKeysArray[i]].subcategory,
            }
        )
    }
}

async function postTask(path, task) {
    let response = await fetch(BASE_URL + path + '.json', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(task)
    })
    return responseToJson = await response.json();
}

async function changeContact(path = "", data = {}) {
    let response = await fetch(BASE_URL + path + '.json', {
        method: "PUT",
        header: {
            "Contact": "application/json",
        },
        body: JSON.stringify(data)
    });
    return response.json();
}



async function postContact(path, newContact) {
    let response = await fetch(BASE_URL + path + '.json', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(newContact)
    })
    return responseToJson = await response.json();
}

async function loadDataContacts(path = "/contacts") {
    let response = await fetch(BASE_URL + path + ".json");
    responseToJson = await response.json();

    contacts = [];
    let contactsKeysArray = Object.keys(responseToJson);
    for (let i = 0; i < contactsKeysArray.length; i++) {
        contacts.push(
            {
                id: contactsKeysArray[i],
                mail: responseToJson[contactsKeysArray[i]].email,
                name: responseToJson[contactsKeysArray[i]].name,
                initials: responseToJson[contactsKeysArray[i]].initialien,
                phone: responseToJson[contactsKeysArray[i]].phone,
                profileColor: responseToJson[contactsKeysArray[i]].profileColor,

            }
        )
    }
}

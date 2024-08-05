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


async function postContact(path, contact) {
    let response = await fetch(BASE_URL + path + '.json', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(contact)
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

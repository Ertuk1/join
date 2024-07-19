let contacts = [
    { name: "Jan Möller" },
    { name: "Max Mustermann" },
    { name: "Sabine Musterfrau" },
]

let contactColors = {};

async function addTaskInit() {
    await includeHTML();
    renderAssignedToContacts();
    showAvailableContacts();
}

function renderAssignedToContacts() {
    let content = document.getElementById('at-contact-container');
    for (let i = 0; i < contacts.length; i++) {
        const contact = contacts[i];
        let initials = getInitials(contact.name);
        content.innerHTML += /*html*/ `
         <div class="at-contact-layout">
            <div class="at-contact-name-container">
                <div id="at-shortcut${i}" class="at-contact-shortcut-layout">
                    <div class="at-contact-shortcut">${initials}</div>
                </div>
                <div class="at-contact-name">${contact.name}</div>
            </div>
            <label class="at-label-checkbox">
                <input type="checkbox">
                <span class="at-checkmark"></span>
            </label>
        </div>`
        setBackgroundColor(initials, i);
    }
}

function getInitials(contact) {
    let names = contact.trim().split(' ');
    initials = names[0].substring(0, 1).toUpperCase();
    if (names.length > 1) {
        initials += names[names.length - 1].substring(0, 1).toUpperCase();
    }
    return initials;
};

function setBackgroundColor(initials, i) {
    if (!contactColors[initials]) {
        let randomColor = Math.floor(Math.random() * 16777215).toString(16);
        contactColors[initials] = "#" + randomColor;
        console.log(contactColors[initials]);
    }
    document.getElementById(`at-shortcut${i}`).style.backgroundColor = contactColors[initials];
}

function showAvailableContacts() {
    let customSelects = document.querySelectorAll('.custom-select');
    customSelects.forEach(function (select) {
        let selectSelected = select.querySelector('.select-selected');
        let selectItems = select.querySelector('.select-items');
        let options = selectItems.querySelectorAll('.at-contact-layout');
        selectItems.style.display = 'none';
        showContactList(customSelects, selectSelected, selectItems)
        chooseContactFromList(options);

        window.addEventListener('click', function (event) {
            if (!select.contains(event.target)) {
                selectItems.style.display = 'none';
            }
        });
    });
}

function showContactList(customSelects, selectSelected, selectItems) {
    selectSelected.addEventListener('click', function (event) {
        event.stopPropagation();
        customSelects.forEach(function (s) {
            s.querySelector('.select-items').style.display = 'none';
        });
        selectItems.style.display = selectItems.style.display === 'block' ? 'none' : 'block';
    });
}
function chooseContactFromList(options) {
    options.forEach(function (option) {
        option.addEventListener('click', function (event) {
            event.stopPropagation();
            let checkbox = option.querySelector('input[type="checkbox"]');
            checkbox.checked = !checkbox.checked;
        });
    });
}



let contacts = [
    { name: "Jan Möller" },
    { name: "Max Mustermann" },
    { name: "Sabine Musterfrau" },
];

let tasks = [];

let contactColors = {};

async function addTaskInit() {
    await includeHTML();
    renderAssignedToContacts();
    showAvailableContacts();
}

function renderAssignedToContacts() {
    let content = document.getElementById('at-contact-container');
    for (let i = 0; i < contacts.length; i++) {
        const contactName = contacts[i].name;
        let initials = getInitials(contactName);
        content.innerHTML += generateAssignedContactsHTML(initials, contactName, i)
        setBackgroundColorInitials(initials, i);
    }
}

function generateAssignedContactsHTML(initials, contactName, i) {
    return /*html*/`
        <div class="at-contact-layout">
            <div class="at-contact-name-container">
                <div id="at-shortcut${i}" class="at-contact-shortcut-layout">
                    <div class="at-contact-shortcut">${initials}</div>
                </div>
            <div class="at-contact-name">${contactName}</div>
        </div>
        <label class="at-label-checkbox">
            <input type="checkbox">
            <span class="at-checkmark"></span>
        </label>
        </div>`
}

function getInitials(contact) {
    let names = contact.trim().split(' ');
    initials = names[0].substring(0, 1).toUpperCase();
    if (names.length > 1) {
        initials += names[names.length - 1].substring(0, 1).toUpperCase();
    }
    return initials;
};

function setBackgroundColorInitials(initials, i) {
    if (!contactColors[initials]) {
        let randomColor = Math.floor(Math.random() * 16777215).toString(16);
        contactColors[initials] = "#" + randomColor;
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

function setBackgroundColorPrio(prio) {
    let prioStatus = document.getElementById(prio);
    let prioImgDeactive = document.getElementById(`${prio}-img-deactive`);
    let prioImgActive = document.getElementById(`${prio}-img-active`);
    resetOtherPriorities(prio);

    if (prioStatus.classList.contains(`at-bg-${prio}`)) {
        removeBackgroundColor(prio, prioStatus,  prioImgDeactive,  prioImgActive)
    } else {
        addBackgroundColor(prio, prioStatus,  prioImgDeactive,  prioImgActive);
    }
}

function addBackgroundColor(prio, prioStatus, prioImgDeactive, prioImgActive) {
    prioStatus.classList.add(`at-bg-${prio}`);
    prioImgDeactive.style.display = 'none';
    prioImgActive.style.display = 'block';
}

function removeBackgroundColor(prio, prioStatus, prioImgDeactive,  prioImgActive) {
    prioStatus.classList.remove(`at-bg-${prio}`);
    prioImgDeactive.style.display = 'block';
    prioImgActive.style.display = 'none';
}

function resetOtherPriorities(selectedPrio) {
    const priorities = ['urgent', 'medium', 'low'];
    priorities.forEach(prio => {
        if (prio !== selectedPrio) {
            let prioStatus = document.getElementById(prio);
            let prioImgDeactive = document.getElementById(`${prio}-img-deactive`);
            let prioImgActive = document.getElementById(`${prio}-img-active`);
            removeBackgroundColor(prio, prioStatus, prioImgDeactive, prioImgActive);
        }
    });
}
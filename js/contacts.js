/**
 * Array of beautiful colors used for profile backgrounds.
 * @type {string[]}
 */
let beautifulColors = [
    'rgb(255, 46, 46)', 'rgb(255, 161, 46)', 'rgb(255, 238, 46)', 'rgb(51, 224, 42)', 'rgb(42, 203, 224)',
    'rgb(42, 115, 224)', 'rgb(139, 42, 224)', 'rgb(218, 42, 224)', 'rgb(232, 58, 133)', 'rgb(232, 58, 58)',
];

let alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

/**
 * Initializes the contact management system.
 * Includes HTML, shows initials, loads contacts, and renders them.
 * @async
 * @function
 * @returns {Promise<void>}
 */
async function contactInit() {
    await includeHTML();
    showInitials();
    await loadDataContacts();
    renderContacts();
}

/**
 * Renders the contact list by calling createContactList.
 * @function
 * @returns {void}
 */
function renderContacts() {
    createContactList();
}

/**
 * Creates a list of contacts and renders them in the DOM.
 * @function
 * @param {number|null} [newContactIndex=null] - Index of the new contact to mark as active.
 * @returns {void}
 */
function createContactList(newContactIndex = null) {
    const contactList = document.getElementById('contact-list');
    contactList.innerHTML = '';
    const seenContacts = new Set(); // Set zum Nachverfolgen der bereits hinzugefügten Kontakte

    for (let j = 0; j < alphabet.length; j++) {
        const letter = alphabet[j];
        let letterAdded = false; // Flag, um zu überprüfen, ob der Buchstabe hinzugefügt wurde

        for (let i = 0; i < contacts.length; i++) {
            const contact = contacts[i];
            const initials = contact.initials;
            const firstLetter = initials.charAt(0).toUpperCase();

            if (firstLetter === letter && !seenContacts.has(contact.name)) {
                if (!letterAdded) {
                    const letterHeading = document.createElement('div');
                    letterHeading.textContent = firstLetter;
                    letterHeading.classList.add('letter-heading');
                    contactList.appendChild(letterHeading);
                    letterAdded = true;
                }

                const contactItem = document.createElement('div');
                contactItem.classList.add('contact');
                if (i === newContactIndex) {
                    contactItem.classList.add('active'); // Markiere den neuen Kontakt als aktiv
                }
                const profileColor = contact['profileColor'];
                const profilePicture = document.createElement('div');
                profilePicture.classList.add('profile-picture');
                profilePicture.style.backgroundColor = profileColor;
                profilePicture.textContent = initials;
                contactItem.appendChild(profilePicture);

                const contactDetails = document.createElement('div');
                contactDetails.classList.add('oneContact');
                contactDetails.innerHTML = `
                      <h2>${contact.name}</h2>
                      <p class="blueColor">${contact.mail}</p>
                  `;
                contactItem.appendChild(contactDetails);
                contactList.appendChild(contactItem);

                // Füge dem Kontakt und den Kontaktinformationen einen Click-Event-Listener hinzu
                contactItem.onclick = function () {
                    // Entferne die 'active' Klasse von allen Kontakten
                    const allContacts = document.querySelectorAll('.contact');
                    allContacts.forEach(c => c.classList.remove('active'));

                    // Füge die 'active' Klasse zum geklickten Kontakt hinzu
                    contactItem.classList.add('active');

                    // Rufe die Kontaktinformationen mit dem aktuellen Kontakt ab
                    contactClickHandler(i);
                };

                seenContacts.add(contact.name); // Kontakt als gesehen markieren
            }
        }
    }
}

/**
 * Extracts initials from a given name.
 * @function
 * @param {string} name - Full name of the contact.
 * @returns {string} - Initials extracted from the name.
 */
function extractInitials(name) {
    const names = name.split(' ');
    let initial = '';
    for (let i = 0; i < names.length; i++) {
        initial += names[i].charAt(0).toUpperCase();
    }
    return initial;
}

/**
 * Validates and adds a new contact to the list.
 * @async
 * @function
 * @returns {Promise<void>}
 */
async function getNewContact() {
    let name = document.getElementById('fullName');
    let email = document.getElementById('emailAdress');
    let phone = document.getElementById('phoneNumber');
    let alertMessage = document.getElementById('addNewContactAlert');
    
    let emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let phonePattern = /^\d{11,}$/; // Regex to check for at least 11 digits

    // Split name by spaces and check if there are at least two words
    let nameParts = name.value.trim().split(' ');

    if (name.value === '' || email.value === '' || phone.value === '') {
        alertMessage.innerHTML = '<p>The fields must be filled.</p>';
    } else if (nameParts.length < 2) {
        alertMessage.innerHTML = '<p>Please enter both a first and last name.</p>';
    } else if (!emailPattern.test(email.value)) {
        alertMessage.innerHTML = '<p>Please enter a valid email address.</p>';
    } else if (!phonePattern.test(phone.value)) {
        alertMessage.innerHTML = '<p style="color: red;">Phone number must be at least 11 digits long.</p>';
    } else {
        const colorIndx = Math.floor(Math.random() * beautifulColors.length);
        const color = beautifulColors[colorIndx];
        const initials = extractInitials(name.value);
        const newContact = {
            mail: email.value,
            name: name.value,
            initials: initials,
            phone: phone.value,
            profileColor: color,
        };
        await postContact("/contacts", newContact);
        await loadDataContacts();
        const newContactIndex = contacts.length - 1;
        createContactList(newContactIndex);
        contactClickHandler(newContactIndex);

        name.value = '';
        email.value = '';
        phone.value = '';
        alertMessage.innerHTML = ''; 

        cancelAddContact();
        slideSuccessfullyContact();
    }
}



/**
 * Handles click events on a contact to show their details.
 * @function
 * @param {number} i - Index of the contact in the contacts array.
 * @returns {void}
 */
function contactClickHandler(i) {
    let contact = contacts[i];
    if (window.innerWidth < 1300) {
        editContactResponsive(contact, i);
    } else {
        let contactSection = document.getElementById('viewContact');
        contactSection.innerHTML = getContactViewTemplate(contact, i);
    }
}

/**
 * Opens the contact editing interface in a responsive layout.
 * @function
 * @param {Object} contact - Contact object.
 * @param {number} i - Index of the contact in the contacts array.
 * @returns {void}
 */
function editContactResponsive(contact, i) {
    document.getElementById('contactListContent').classList.add('d-none');
    document.getElementById('contactContent').classList.remove('d-noneResp');
    document.getElementById('addContactResp').classList.add('d-noneResp');
    
    let contactSection = document.getElementById('viewContact');
    contactSection.innerHTML = getResponsiveContactTemplate(contact, i);
}

/**
 * Shows the editing div with a sliding animation.
 * @function
 * @param {number} i - Index of the contact in the contacts array.
 * @returns {void}
 */
function showEditDiv(i) {
    let editDivResp = document.getElementById('editDivResp');
    setTimeout(() => {
        editDivResp.style.right = '6px';
    }, 10);

}

/**
 * Closes the editing div with a sliding animation.
 * @function
 * @returns {void}
 */
/* function closeEditDiv() {
    let editDivResp = document.getElementById('editDivResp');
    setTimeout(() => {
        editDivResp.style.right = '-200px';
    }, 10);
} */

/**
 * Closes the responsive contact editing interface.
 * @function
 * @returns {void}
 */
function closeEditResponsive() {
     // Entferne die 'active' Klasse von allen Kontakten
     const allContacts = document.querySelectorAll('.contact');
     allContacts.forEach(c => c.classList.remove('active'));
    document.getElementById('contactListContent').classList.remove('d-none');
    document.getElementById('contactContent').classList.add('d-noneResp');
    // document.getElementById('editContactThirdSection').classList.remove('d-noneResp');
    document.getElementById('addContactResp').classList.remove('d-noneResp');
}

/**
 * Shows a success message when a contact is successfully added.
 * @function
 * @returns {void}
 */
function slideSuccessfullyContact() {
    let container = document.getElementById('successfullyContainer');
    let successfully = document.getElementById('successfully');
    container.style.display = 'flex';
    successfully.classList.add('slide-in-bottom');
    setTimeout(() => {
        successfully.classList.remove('slide-in-bottom');
        container.style.display = 'none';
    }, 1000);
}

/**
 * Opens the contact editing interface.
 * @async
 * @function
 * @param {number} i - Index of the contact in the contacts array.
 * @returns {Promise<void>}
 */
async function showEditContact(i) {
    let contact = contacts[i];
    let name = contact.name;
    isItYou = name.includes('(You)');
    let displayName = isItYou ? name.substr(0, name.length - 12) : name;

    const color = contact['profileColor'];

    document.getElementById('editContactSecondSection').innerHTML = '';
    document.getElementById('blurBackgroundEdit').classList.remove('d-none');
    editContact.style.display = "flex";
    setTimeout(() => {
        editContact.style.bottom = "0";
        editContact.style.right = "0";
    }, 10);
    document.getElementById('editContactSecondSection').innerHTML = editContactHTML(i);
    document.getElementById('editName').value = displayName;
    document.getElementById('editEmail').value = contact.mail;
    document.getElementById('editPhone').value = contact.phone;
    document.getElementById('initialsEditContact').style.backgroundColor = color;
    document.getElementById('initialsText').innerHTML = contact.initials;
    // closeEditResponsive();
}

function editContactHTML(i) {
    let contact = contacts[i];
    return getEditContactTemplate(contact, i);
}

async function editContactToArray(i) {
    let contact = contacts[i];
    let name = document.getElementById('editName');
    let email = document.getElementById('editEmail');
    let phone = document.getElementById('editPhone');
    let alertMessage = document.getElementById('addNewContactAlertedit');
    const initial = extractInitials(name.value);

    let emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let phonePattern = /^\d{11,}$/; // Regex to check for at least 11 digits

    // Split name by spaces and check if there are at least two words
    let nameParts = name.value.trim().split(' ');

    if (name.value === '') {
        alertMessage.innerHTML = '<p style="color: red;">Please enter both a first and last name.</p>';
    } else if (nameParts.length < 2) {
        alertMessage.innerHTML = '<p style="color: red;">Please enter both a first and last name.</p>';
    } else if (!emailPattern.test(email.value)) {
        alertMessage.innerHTML = '<p style="color: red;">Please enter a valid email address.</p>';
    } else if (!phonePattern.test(phone.value)) {
        alertMessage.innerHTML = '<p style="color: red;">Phone number must be at least 11 digits long.</p>';
    } else {
        let myName = isItYou ? name.value + ' (You)' : name.value;

        const updatedContact = {
            "name": myName,
            "mail": email.value,
            "phone": phone.value,
            "profileColor": contact.profileColor,
            "initials": initial
        };

        await updateContact("/contacts/" + contact.id, updatedContact);
        await loadDataContacts();
        contactClickHandler(contacts.length - 1);

        alertMessage.innerHTML = ''; // Clear alert message
        cancelEditContact();
        createContactList();
    }
}


// Öffnet die Box 'Add new Contact'
function showAddContact() {
    document.getElementById('addNewContactAlert').innerHTML = '';
    document.getElementById('blurBackground').classList.remove('d-none');
    addNewContact.style.display = "flex";
    setTimeout(() => {
        addNewContact.style.right = "0";
        addNewContact.style.bottom = "0";
    }, 10);
}

function cancelAddContact() {
    setTimeout(() => {
        addNewContact.style.right = "-6000px";
        addNewContact.style.bottom = "-6000px";
        addNewContact.style.display = "none";
        document.getElementById('blurBackground').classList.add('d-none');
    }, 10);
    
}

function cancelEditContact() {
    setTimeout(() => {
        editContact.style.right = "-6000px";
        editContact.style.bottom = "-6000px";
        editContact.style.display = "none";
        document.getElementById('blurBackgroundEdit').classList.add('d-none');
    }, 10);
    
}




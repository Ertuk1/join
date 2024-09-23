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
/**
 * Creates a list of contacts and renders them in the DOM.
 * @function
 * @param {number|null} [newContactIndex=null] - Index of the new contact to mark as active.
 * @returns {void}
 */
function createContactList(newContactIndex = null) {
    const contactList = document.getElementById('contact-list');
    contactList.innerHTML = '';
    const seenContacts = new Set();
    alphabet.forEach(letter => {
        let letterAdded = false;
        contacts.forEach((contact, i) => {
            const initials = contact.initials;
            const firstLetter = initials.charAt(0).toUpperCase();
            if (firstLetter === letter && !seenContacts.has(contact.name)) {
                if (!letterAdded) {
                    addLetterHeading(contactList, letter);
                    letterAdded = true;
                }
                addContactItem(contactList, contact, i, newContactIndex);
                seenContacts.add(contact.name);
            }
        });
    });
}

/**
 * Adds a letter heading to the contact list.
 * @param {HTMLElement} contactList - The element to append the heading to.
 * @param {string} letter - The letter to display as a heading.
 */
function addLetterHeading(contactList, letter) {
    const letterHeading = document.createElement('div');
    letterHeading.textContent = letter;
    letterHeading.classList.add('letter-heading');
    contactList.appendChild(letterHeading);
}

/**
 * Adds a contact item to the contact list.
 * @function
 * @param {HTMLElement} contactList - The element to append the contact item to.
 * @param {Object} contact - The contact object containing details.
 * @param {number} index - The index of the contact in the contacts array.
 * @param {number|null} newContactIndex - Index of the new contact to mark as active.
 * @returns {void}
 */
function addContactItem(contactList, contact, index, newContactIndex) {
    const contactItem = document.createElement('div');
    contactItem.classList.add('contact');
    if (index === newContactIndex) contactItem.classList.add('active');
    const profilePicture = document.createElement('div');
    profilePicture.classList.add('profile-picture');
    profilePicture.style.backgroundColor = contact.profileColor;
    profilePicture.textContent = contact.initials;
    contactItem.appendChild(profilePicture);
    contactItem.innerHTML += `
        <div class="oneContact">
            <h2>${contact.name}</h2>
            <p class="blueColor">${contact.mail}</p>
        </div>
    `;
    contactItem.onclick = () => handleContactClick(contactItem, index);
    contactList.appendChild(contactItem);
}

/**
 * Handles click events on a contact to show their details.
 * @param {HTMLElement} contactItem - The clicked contact item.
 * @param {number} index - Index of the contact in the contacts array.
 */
function handleContactClick(contactItem, index) {
    document.querySelectorAll('.contact').forEach(c => c.classList.remove('active'));
    contactItem.classList.add('active');
    contactClickHandler(index);
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
    const { value: nameValue } = document.getElementById('fullName');
    const { value: emailValue } = document.getElementById('emailAdress');
    const { value: phoneValue } = document.getElementById('phoneNumber');
    const alertMessage = document.getElementById('addNewContactAlert');

    const validationError = validateContact(nameValue, emailValue, phoneValue, alertMessage);
    if (validationError) return alertMessage.innerHTML = validationError;

    const color = beautifulColors[Math.floor(Math.random() * beautifulColors.length)];
    const initials = extractInitials(nameValue);
    const newContact = createContactObject(nameValue, emailValue, phoneValue, initials, color);

    await postContact("/contacts", newContact);
    await loadDataContacts();
    const newContactIndex = contacts.length - 1;
    createContactList(newContactIndex);
    contactClickHandler(newContactIndex);
    clearFields('add');
    cancelAddContact();
    slideSuccessfullyContact();
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
    document.addEventListener('click', outsideClickListener);
    function outsideClickListener(event) {
        if (!editDivResp.contains(event.target)) {
            closeEditDiv(); 
            removeOutsideClickListener(); 
        }
    }

function removeOutsideClickListener() {
        document.removeEventListener('click', outsideClickListener);
    }
}

/**
 * Closes the editing div with a sliding animation.
 * @function
 * @returns {void}
 */
 function closeEditDiv() {
    let editDivResp = document.getElementById('editDivResp');
    setTimeout(() => {
        editDivResp.style.right = '-200px';
    }, 10);
} 

/**
 * Closes the responsive contact editing interface.
 * @function
 * @returns {void}
 */
function closeEditResponsive() {
     const allContacts = document.querySelectorAll('.contact');
     allContacts.forEach(c => c.classList.remove('active'));
    document.getElementById('contactListContent').classList.remove('d-none');
    document.getElementById('contactContent').classList.add('d-noneResp');
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
    const contact = contacts[i];
    const displayName = contact.name.replace(/\s*\(You\)$/, '');
    const color = contact.profileColor;
    document.getElementById('editContactSecondSection').innerHTML = editContactHTML(i);
    document.getElementById('blurBackgroundEdit').classList.remove('d-none');
    editContact.style.display = "flex";
    setTimeout(() => {
        editContact.style.bottom = "0"; 
        editContact.style.right = "0";
    }, 10);
    ['editName', 'editEmail', 'editPhone'].forEach((id, idx) => 
        document.getElementById(id).value = [displayName, contact.mail, contact.phone][idx]);
    document.getElementById('initialsEditContact').style.backgroundColor = color;
    document.getElementById('initialsText').innerHTML = contact.initials;
}

/**
 * Returns the HTML template for editing a contact.
 * @param {number} i - Index of the contact.
 * @returns {string} - HTML template for the contact.
 */
function editContactHTML(i) {
    let contact = contacts[i];
    return getEditContactTemplate(contact, i);
}

/**
 * Validates and updates a contact in the array.
 * @param {number} i - Index of the contact to edit.
 * @returns {Promise<void>}
 */
async function editContactToArray(i) {
    const { value: nameValue } = document.getElementById('editName');
    const { value: emailValue } = document.getElementById('editEmail');
    const { value: phoneValue } = document.getElementById('editPhone');
    const alertMessage = document.getElementById('addNewContactAlertedit');
    const validationError = validateContact(nameValue, emailValue, phoneValue, alertMessage);
    if (validationError) return alertMessage.innerHTML = validationError;
    const initials = extractInitials(nameValue);
    const updatedContact = createContactObject(nameValue, emailValue, phoneValue, initials, contacts[i].profileColor);
    await updateContact(`/contacts/${contacts[i].id}`, updatedContact);
    await loadDataContacts();
    contactClickHandler(contacts.length - 1);
    clearFields('edit');
    cancelEditContact();
    createContactList();
}


/**
 * Validates contact input fields.
 * @param {HTMLElement} alertMessage - Element to display error messages.
 * @returns {string|null} - Error message or null if valid.
 */
function validateContact(name, email, phone, alertMessage) {
    const nameParts = name.trim().split(' ');
    if (nameParts.length < 2) return '<p>Please enter both a first and last name.</p>';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return '<p>Please enter a valid email address.</p>';
    if (!/^\d{11,}$/.test(phone)) return '<p style="color: red;">Phone number must be at least 11 digits long.</p>';
    return null;
}
/**
 * Creates a contact object.
 * @returns {Object} - Contact object.
 */
function createContactObject(name, email, phone, initials, profileColor) {
    return {
        name: name,
        mail: email,
        phone: phone,
        profileColor: profileColor,
        initials: initials
    };
}

/**
 * Clears input fields based on the action type.
 * @param {string} action - Type of action (edit/add).
 */
function clearFields(action) {
    const fields = action === 'edit' ? ['editName', 'editEmail', 'editPhone'] : ['fullName', 'emailAdress', 'phoneNumber'];
    fields.forEach(id => document.getElementById(id).value = '');
}

/**
 * Shows the "Add New Contact" dialog.
 */
function showAddContact() {
    document.getElementById('addNewContactAlert').innerHTML = '';
    document.getElementById('blurBackground').classList.remove('d-none');
    let addNewContact = document.getElementById('addNewContact');
    addNewContact.style.display = "flex"; 
    setTimeout(() => {
        addNewContact.style.right = "0";  
        addNewContact.style.bottom = "0"; 
    }, 10);
}

/**
 * Cancels adding a new contact and hides the dialog.
 */
function cancelAddContact() {
    let addNewContact = document.getElementById('addNewContact');
    addNewContact.style.right = "-6000px";  
    addNewContact.style.bottom = "-6000px"; 
    setTimeout(() => {
        addNewContact.style.display = "none"; 
        document.getElementById('blurBackground').classList.add('d-none');
    }, 800); 
}

/**
 * Cancels editing a contact and hides the dialog.
 */
function cancelEditContact() {
    closeEditContact(); 
    setTimeout(() => {
        let editContact = document.getElementById('editContact');
        editContact.style.display = "none";
        document.getElementById('blurBackgroundEdit').classList.add('d-none');
    }, 800); 
}

/**
 * Closes the contact editing dialog with a sliding animation.
 */
function closeEditContact() {
    let editContact = document.getElementById('editContact');
    editContact.style.right = "-6000px"; 
    editContact.style.bottom = "-6000px"; 
}
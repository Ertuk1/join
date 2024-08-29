
let beautifulColors = [
    'rgb(255, 46, 46)', 'rgb(255, 161, 46)', 'rgb(255, 238, 46)', 'rgb(51, 224, 42)', 'rgb(42, 203, 224)',
    'rgb(42, 115, 224)', 'rgb(139, 42, 224)', 'rgb(218, 42, 224)', 'rgb(232, 58, 133)', 'rgb(232, 58, 58)',
];

let alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

async function contactInit() {
    await includeHTML();
    showInitials();
    await loadDataContacts();
    renderContacts();
}

function renderContacts() {
    createContactList();
}

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

// Hilfsfunktion zum Extrahieren des ersten Buchstabens des Vornamens und Nachnamens
function extractInitials(name) {
    const names = name.split(' ');
    let initial = '';
    for (let i = 0; i < names.length; i++) {
        initial += names[i].charAt(0).toUpperCase();
    }
    return initial;
}

async function getNewContact() {
    let name = document.getElementById('fullName');
    let email = document.getElementById('emailAdress');
    let phone = document.getElementById('phoneNumber');
    if (name.value == '' || email.value == '' || phone.value == '') {
        document.getElementById('addNewContactAlert').innerHTML = '';
        document.getElementById('addNewContactAlert').innerHTML = '<p>the fields must be filled</p>';
    } else {
        const colorIndx = Math.floor(Math.random() * beautifulColors.length); // Zufälliger Index für Farbe
        const color = beautifulColors[colorIndx];
        const initialien = extractInitials(name.value);
        const newContact = {
            mail: email.value,
            name: name.value,
            initials: initialien,
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
        cancelAddContact();
        slideSuccessfullyContact();
    }
}

// Funktion, die beim Klicken auf den Kontakt oder Kontaktinformationen aufgerufen wird
function contactClickHandler(i) {
    let contact = contacts[i];
    if (window.innerWidth < 1300) {
        editContactResponsive(contact, i);
    }
    else {
        let contactSection = document.getElementById('viewContact');
        contactSection.innerHTML = '';
        contactSection.innerHTML =
            `<div class="profileName">
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
              <a id="emailFromContact" href="mailto:${contact.mail}" >${contact.mail}</a>
          </div>
          <div class="showOneContactInfo">
              <h3>Phone</h3>
              <p id="phoneFromContact">${contact.phone}</p>
          </div>
      </div>
  </div>`;
    }
}

function editContactResponsive(contact, i) {
    document.getElementById('contactListContent').classList.add('d-none');
    document.getElementById('contactContent').classList.remove('d-noneResp');
    // document.getElementById('editContactThirdSection').classList.remove('d-noneResp');
    document.getElementById('addContactResp').classList.add('d-noneResp');
    let contactSection = document.getElementById('viewContact');
    contactSection.innerHTML = '';
    contactSection.innerHTML =
        `<div onclick="closeEditDiv()">
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
      <div class="showOneContact" onclick="closeEditDiv()">
          <div class="showOneContactInfo">
              <h3>Email</h3>
              <a id="emailFromContact" href="mailto:${contact.mail}" >${contact.mail}</a>
          </div>
          <div class="showOneContactInfo">
              <h3>Phone</h3>
              <p id="phoneFromContact">${contact.phone}</p>
          </div>
      </div>
  </div>
  <div onclick="event.stopPropagation(), showEditDiv(${i})" id="editContactThirdSection"><img src="./assets/img/points_white.png" alt=""></div>
  <div id="editDivResp" onclick="event.stopPropagation()">
  <div id="editContactResp" onclick="event.stopPropagation(event), showEditContact(${i})"><img src="./assets/img/edit_contact.png" alt=""><p>Edit</p></div>
  <div id="deleteContactResp" onclick="event.stopPropagation(event), deleteContact('/contacts/${contact.id}'), closeEditResponsive()"><img src="./assets/img/delete_contact.png" alt=""><p>Delete</p></div>
  </div>
  </div`;
}

function showEditDiv(i) {
    let editDivResp = document.getElementById('editDivResp');
    setTimeout(() => {
        editDivResp.style.right = '6px';
    }, 10);

}

function closeEditDiv() {
    let editDivResp = document.getElementById('editDivResp');
    setTimeout(() => {
        editDivResp.style.right = '-200px';
    }, 10);
}

function closeEditResponsive() {
     // Entferne die 'active' Klasse von allen Kontakten
     const allContacts = document.querySelectorAll('.contact');
     allContacts.forEach(c => c.classList.remove('active'));
    document.getElementById('contactListContent').classList.remove('d-none');
    document.getElementById('contactContent').classList.add('d-noneResp');
    // document.getElementById('editContactThirdSection').classList.remove('d-noneResp');
    document.getElementById('addContactResp').classList.remove('d-noneResp');
}

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
    return `
    <div id="closeAddContactDiv"><img onclick="cancelEditContact()" id="addNewContactCloseButton"
                        src="/assets/img/Close.png" alt="close"></div>
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
                            <div id="inputBox" class="inputBox"><input class="inputBlueBorder" id="editName"
                                    required type="text" placeholder="Name">
                                <img src="/assets/img/person.png">
                            </div>
                            <div class="inputBox"><input id="editEmail" type="email" required
                                    placeholder="Email">
                                <img src="/assets/img/mail.png">
                            </div>
                            <div class="inputBox"><input id="editPhone" type="number"
                                    pattern="[0-9]" placeholder="Phone"> <img src="/assets/img/call.png">
                            </div>
                        </div>
                        <div id="addNewContactAlert"></div>
                        <div id="btnDiv">
                            <button onclick="cancelEditContact(); deleteDataContact('/contacts/${contact.id}')" id="cancelButtonContact">Delete<img id="cancelIcon"
                                    src="./assets/img/cancel(x).png" alt=""></button>
                            <button onclick="editContactToArray(${i}), deleteDataContact('/contacts/${contact.id}')"  id="editContactButton">Save<img
                                    src="./assets/img/check.png" alt=""></button>
                        </div>
                </div>
            </div>
     </div>`;
}

async function editContactToArray(i) {
    let contact = contacts[i];
    let name = document.getElementById('editName');
    let email = document.getElementById('editEmail');
    let phone = document.getElementById('editPhone');
    const initial = extractInitials(name.value);

    let myName = isItYou ? name.value + ' (You)' : name.value;

    const newContact = {
        "name": myName,
        "mail": email.value,
        "phone": phone.value,
        "profileColor": contact.profileColor,
        "initials": initial
    };

    await postContact("/contacts", newContact);
    await loadDataContacts();
    contactClickHandler(contacts.length - 1);
    cancelEditContact();
    createContactList();
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




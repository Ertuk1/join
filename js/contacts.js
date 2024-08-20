
let beautifulColors = [
    'rgb(255, 46, 46)', 'rgb(255, 161, 46)', 'rgb(255, 238, 46)', 'rgb(51, 224, 42)', 'rgb(42, 203, 224)',
    'rgb(42, 115, 224)', 'rgb(139, 42, 224)', 'rgb(218, 42, 224)', 'rgb(232, 58, 133)', 'rgb(232, 58, 58)',
];

let alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

async function contactInit() {
    await includeHTML();
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
                contactItem.onclick = function() {
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

        const newContactIndex = contacts.length - 1; // Index des neu hinzugefügten Kontakts
        createContactList(newContactIndex); // Neue Liste erstellen und neuen Kontakt hervorheben
        contactClickHandler(newContactIndex); // Zeige die Details des neuen Kontakts an

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
    if (window.innerWidth < 1000) {
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
              <div class="editBox" id="editDiv"><img src="assets/img/edit_contact.png" alt="edit">
                  <p>Edit</p>
              </div>
              <div class="editBox" id=deleteDiv onclick="deleteContact('/contacts/${contact.id}')"><img src="assets/img/delete_contact.png" alt="">
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

// Öffnet die Box 'Add new Contact'
function showAddContact() {
    document.getElementById('addNewContactAlert').innerHTML = '';
    document.getElementById('addNewContact').classList.add('addnewContactActive');
    document.getElementById('blurBackground').classList.remove('d-none');
}

function cancelAddContact() {
    document.getElementById('addNewContact').classList.remove('addnewContactActive');
    document.getElementById('blurBackground').classList.add('d-none');
}

function cancelEditContact() {
    document.getElementById('blurBackgroundEdit').classList.add('d-none');
  }




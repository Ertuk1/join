
let beautifulColors = [
    'rgb(255, 46, 46)', 'rgb(255, 161, 46)', 'rgb(255, 238, 46)', 'rgb(51, 224, 42)', 'rgb(42, 203, 224)',
    'rgb(42, 115, 224)', 'rgb(139, 42, 224)', 'rgb(218, 42, 224)', 'rgb(232, 58, 133)', 'rgb(232, 58, 58)',
];

let alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

async function contactInit() {
    await loadDataContacts();
    await includeHTML();
    renderContacts();
}

function renderContacts() {
    createContactList();
}

// Funktion zum Erstellen der Kontaktliste
function createContactList() {
    const contactList = document.getElementById('contact-list');
    contactList.innerHTML = '';
    let currentLetter = null;
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
                contactItem.addEventListener('click', handleClick);
                function handleClick(event) {
                    // Stelle sicher, dass nur das geklickte Element behandelt wird
                    if (event.target === contactItem || event.target.parentElement === contactDetails) {
                        // Rufe die Kontaktinformationen mit dem aktuellen Kontakt ab
                        contactClickHandler(contact, i);
                    }
                }
                seenContacts.add(contact.name); // Kontakt als gesehen markieren
            }
        }
    }
}

// Hilfsfunktion zum Extrahieren des ersten Buchstabens des Vornamens und Nachnamens
function extractInitials(name) {
    const names = name.split(' ');
    let initials = '';
    for (let i = 0; i < names.length; i++) {
        initials += names[i].charAt(0).toUpperCase();
    }
    return initials;
}

async function getNewContact() {
    let name = document.getElementById('fullName');
    let mail = document.getElementById('emailAdress');
    let phone = document.getElementById('phoneNumber');
    if (name.value == '' || mail.value == '' || phone.value == '') {
      document.getElementById('addNewContactAlert').innerHTML = '';
      document.getElementById('addNewContactAlert').innerHTML = '<p>the fields must be filled</p>';
    } else {
      const colorIndx = Math.floor(Math.random() * beautifulColors.length); // Zufälliger Index für Farbe
      const color = beautifulColors[colorIndx];
      const initial = extractInitials(name.value);
      const newContact = {
        email: mail.value,
        name: name.value,
        initialien: initial,
        phone: phone.value,
        profileColor: color,
      };
      await postContact("/contacts", newContact);
      await loadDataContacts();
    //   contactClickHandler(newContact, contacts.length - 1);
    createContactList();
    name.value = '';
    mail.value = '';
    phone.value = '';
    cancelAddContact();
    slideSuccessfullyContact();
    }
}

// Funktion, die beim Klicken auf den Kontakt oder Kontaktinformationen aufgerufen wird
function contactClickHandler(contact, i) {
    if (window.innerWidth < 1000) {
      editContactResponsive(contact, i);
    }
    else {
      let contactSection = document.getElementById('contacts');
      contactSection.innerHTML = '';
      contactSection.innerHTML = ` <div id="contactInfo">
      <div id="whiteCircle">
        <div id="initials" style="background-color: ${contact.profileColor}">
          <h1>${contact.initialien}</h1>
        </div>
      </div>
      <div id="nameAndEditButton">
        <h1>${contact.name}</h1>
        <div id="editDiv">
          <img id="edit" onclick="showeditContact(${i})" src="../assets/img/buttonIcons/edit_normal.png" alt="edit">
          <img id="delete" onclick="deleteContact(${i})" src="../assets/img/buttonIcons/delete_normal.png" alt="delete" > 
        </div>
      </div>
    </div>
    <div id="contactInformation">
      <h2>Contact Information</h2>
    </div>
    <div id="contactContent">
      <div id="emailBox">
        <h3>Email</h3>
        <a href="mailto:julia.sch@hotmail.de">${contact.email}</a>
      </div>
      <div id="phoneBox">
        <h3>Phone</h3>
        <p>${contact.phone}</p>
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

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

// Öffnet die Box 'Add new Contact'
function showAddContact() {
    document.getElementById('addNewContactAlert').innerHTML = '';
    document.getElementById('addNewContact').classList.add('addnewContactActive');
    document.getElementById('blurBackground').classList.remove('d-none');
    document.getElementById('buttonActiveImg').classList.add('buttonActiveImg');
    document.getElementById('addContactButton').classList.add('buttonActive');
}

function cancelAddContact() {
    document.getElementById('addNewContact').classList.remove('addnewContactActive');
    document.getElementById('blurBackground').classList.add('d-none');
    document.getElementById('buttonActiveImg').classList.remove('buttonActiveImg');
    document.getElementById('addContactButton').classList.remove('buttonActive');
}
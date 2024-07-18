let contacts = [
    {
        "name": "Julia Schäffer",
        "email": "julia.sch@hotmail.de",
        "phone": "+491778965144",
        "profileColor": "rgb(255, 161, 46)",
        "initialien": "JS"
    },
    {
        "name": "Philipp Peter",
        "email": "philipp@gmx.com",
        "phone": "+48328420128",
        "profileColor": "rgb(42, 115, 224)",
        "initialien": "PP"
    },
    {
        "name": "Jan Moller",
        "email": "Hello@gmail.com",
        "phone": "+982393403",
        "profileColor": "rgb(232, 58, 58)",
        "initialien": "JM"
    },
    {
        "name": "Nathalie Strauchmann",
        "email": "strauchmann89@yahoo.de",
        "phone": "+49151338395",
        "profileColor": "rgb(139, 42, 224)",
        "initialien": "NS"
    },
    {
        "name": "Melanie Müller",
        "email": "m.muellerstreich@gmail.com",
        "phone": "+491760152757",
        "profileColor": "rgb(255, 46, 46)",
        "initialien": "MM"
    },
    {
        "name": "Herbert Peter",
        "email": "Petermann@hotmail.de",
        "phone": "+491723687234",
        "profileColor": "rgb(232, 58, 133)",
        "initialien": "HP"
    },
    {
        "name": "Heiko Lee",
        "email": "h.lee99@home.com",
        "phone": "",
        "profileColor": "rgb(232, 58, 58)",
        "initialien": "HL"
    },
];


let beautifulColors = [
    'rgb(255, 46, 46)', 'rgb(255, 161, 46)', 'rgb(255, 238, 46)', 'rgb(51, 224, 42)', 'rgb(42, 203, 224)',
    'rgb(42, 115, 224)', 'rgb(139, 42, 224)', 'rgb(218, 42, 224)', 'rgb(232, 58, 133)', 'rgb(232, 58, 58)',
];

let alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];


async function contactInit() {
    await includeHTML();
    renderContacts();
}

function renderContacts() {
    createContactList();
}

// Funktion zum Erstellen der Kontaktliste
function createContactList() {
    const contactList = document.getElementById('contactListContent');
    contactList.innerHTML = '';
    let currentLetter = null;
    const seenContacts = new Set(); // Set zum Nachverfolgen der bereits hinzugefügten Kontakte
  
    for (let j = 0; j < alphabet.length; j++) {
      const letter = alphabet[j];
      let letterAdded = false; // Flag, um zu überprüfen, ob der Buchstabe hinzugefügt wurde
  
      for (let i = 0; i < contacts.length; i++) {
        const contact = contacts[i];
        const initials = contact.initialien;
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
                      <p class="blueColor">${contact.email}</p>
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
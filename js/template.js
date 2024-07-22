
async function includeHTML() {
    let includeElements = document.querySelectorAll('[w3-include-html]');
    for (let i = 0; i < includeElements.length; i++) {
        const element = includeElements[i];
        file = element.getAttribute("w3-include-html");
        let resp = await fetch(file);
        if (resp.ok) {
            element.innerHTML = await resp.text();
        } else {
            element.innerHTML = 'Page not found';
        }
    }
}

function openSubMenu(){
 // Wähle das Element anhand seiner ID aus
let element = document.getElementById('subMenu');

// Überprüfe, ob das Element die Klasse "beispielKlasse" hat
if (element.classList.contains('d-none')) {
    element.classList.remove('d-none');
} else {
    element.classList.add('d-none');
 }
}
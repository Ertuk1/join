function getChoosedContactsHTML(maxVisibleContacts) {
    let html = choosedContacts.slice(0, maxVisibleContacts).map((contact, i) =>
        `<div class="at-choosed-contact-shortcut" id="at-choosed-shortcut${i}">
            <div class="at-contact-shortcut">${contact.initial}</div>
        </div>`).join('');

    if (choosedContacts.length > maxVisibleContacts) {
        html += `<div class="at-choosed-contact-shortcut" style="background-color: rgb(218, 42, 224);">
                    <div class="at-contact-shortcut">+${choosedContacts.length - maxVisibleContacts}</div>
                </div>`;
    }
    return html;
}

/**
 * Template for rendering each subcategory input.
 * @param {string} subcategory - The subcategory name.
 * @param {number} index - The index of the subcategory.
 * @returns {string} The HTML template for the subcategory.
 */
function getSubcategoryTemplate(subcategory, index) {
    return `
    <div class="choosed-subcategorie-container">
        <input class="choosed-subcategory-input" value="${subcategory}" id="choosed-subcategory-${index}">
        <div class="choosed-subcategorie-btn-container">
            <img onclick="focusInput('choosed-subcategory-${index}')" class="at-choosed-subcategory-edit" src="assets/img/editDark.png">
            <div class="small-border-container"></div>
            <img onclick="removeSubcategory(${index})" class="at-choosed-subcategory-delete" src="assets/img/delete.png">
        </div>
        <div class="choosed-subcategorie-btn-container-active-field">
            <img onclick="removeSubcategory(${index})" class="at-choosed-subcategory-delete" src="assets/img/delete.png">
            <div class="small-border-container-gray"></div>
            <img class="at-choosed-subcategory-check" src="assets/img/checkOkDarrk.png">
        </div>
    </div>`;
}

/**
 * Generates the HTML for a single subtask input.
 * @function generateSubtaskHTML
 * @param {string} subcategory - The name of the subcategory.
 * @param {number} index - The index of the subcategory.
 * @returns {string} The HTML for the subtask input.
 */
function generateSubtaskHTML(subcategory, index) {
    return /*html*/`
    <div class="choosed-subcategorie-container">
        <input class="choosed-subcategory-input" value="${subcategory}" id="choosed-subcategory-${index}">
        <div class="choosed-subcategorie-btn-container">
            <img onclick="focusInput('choosed-subcategory-${index}')" class="at-choosed-subcategory-edit" src="assets/img/editDark.png" id="at-choosed-subcategory-edit-${index}">
            <div class="small-border-container"></div>
            <img onclick="removeSubcategory(${index})" class="at-choosed-subcategory-delete" src="assets/img/delete.png" id="at-choosed-subcategory-delete-${index}">
        </div>
        <div class="choosed-subcategorie-btn-container-active-field">
            <img onclick="removeSubcategory(${index})" class="at-choosed-subcategory-delete" src="assets/img/delete.png" id="at-choosed-subcategory-delete-active-${index}">
            <div class="small-border-container-gray"></div>
            <img class="at-choosed-subcategory-check" src="assets/img/checkOkDarrk.png" id="at-choosed-subcategory-check-active-${index}">
        </div>
    </div>`;
}
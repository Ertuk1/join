async function addTaskInit() {
    await includeHTML();
    showAvailableContacts();
}


function showAvailableContacts() {
    let customSelects = document.querySelectorAll('.custom-select');

    customSelects.forEach(function (select) {
        let selectSelected = select.querySelector('.select-selected');
        let selectItems = select.querySelector('.select-items');
        let options = selectItems.querySelectorAll('div');

        selectItems.style.display = 'none';

        selectSelected.addEventListener('click', function (event) {
            event.stopPropagation();
            customSelects.forEach(function (s) {
                s.querySelector('.select-items').style.display = 'none';
            });
            selectItems.style.display = selectItems.style.display === 'block' ? 'none' : 'block';
        });

        options.forEach(function (option) {
            option.addEventListener('click', function (event) {
                event.stopPropagation();
                selectSelected.textContent = option.textContent;
                selectItems.style.display = 'none';
            });
        });

        window.addEventListener('click', function () {
            selectItems.style.display = 'none';
        });
    });
}


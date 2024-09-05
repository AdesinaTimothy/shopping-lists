
const itemInput = document.getElementById('item-input');
const itemForm = document.getElementById('item-form')
const itemfilter = document.getElementById('filter');
const itemList = document.getElementById('item-List');
const clearAllBtn = document.getElementById('clear-all');
const fromBtn = document.querySelector('button');
let isEditMode = false;

function displayItems () {
    const itemsFromStorage = getItemsFromStorage();

    itemsFromStorage.forEach((item) => {
        addItemToDom (item);
    })

    clearUi();
}

function addItemOnSubmit (e) {
    e.preventDefault();

    const newItem = itemInput.value

    // Validate input Item
    if ( newItem === '') {
        alert('Please add an item');
        return;
    };

    // Check for Edit Mode 
    if (isEditMode) {
        const itemToEdit = itemList.querySelector('.edit-mode');

        removeItemFromStorage(itemToEdit.textContent);
        itemToEdit.classList.remove('edit-mode');
        itemToEdit.remove();

        isEditMode = false;
    } else {
        if (checkIfItemExists(newItem)) {
            alert('That item already exists!')
            return;
        }
    }

    // Add item to DOM
    addItemToDom(newItem);

    //Add Item to localstorage 
    addItemToStorage (newItem);

    itemInput.value = '';

    clearUi ();
}


function onClickItem (e) {
        if (e.target.parentElement.classList.contains('remove-item')) {
            removeItem(e.target.parentElement.parentElement);
        } else {
            setItemToEdit(e.target);
        }
    }


function setItemToEdit (item) {
    isEditMode = true;

    itemList.querySelectorAll('li').forEach((i) => {
        i.classList.remove('edit-mode');
    })


    item.classList.add('edit-mode');
    fromBtn.innerHTML = '<i class = "fa-solid fa-pen"></i> Update Item';
    fromBtn.style.backgroundColor = 'green';
    fromBtn.style.border = 'white 0.5px solid';

    itemInput.value = item.textContent;
}


function checkIfItemExists (item) {
    const itemsFromStorage = getItemsFromStorage();

    return itemsFromStorage.includes(item);
}

function removeItem (item) {
    if (confirm ('Are you sure?')) {
        item.remove();


        
    //Remove Item from Storage
    removeItemFromStorage (item.textContent);


    clearUi();
    }

}

function removeItemFromStorage (item) {
    let itemsFromStorage = getItemsFromStorage();

    //Filter out items to be removed
    itemsFromStorage = itemsFromStorage.filter ((i) => i !== item);

    //reset to local storage
    localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}




function addItemToDom (item) {
    const li = document.createElement('li');
    li.appendChild(document.createTextNode(item));

    const button = createButton('remove-item btn-link text-red');
    li.appendChild(button);

    itemList.appendChild(li);
}

function createButton (classes) {
    const button = document.createElement('button');
    button.className = classes

    const icon = createIcon('fa-solid fa-xmark');
    button.appendChild(icon);
    return button;
}

function createIcon (classes) {
    const icon = document.createElement('i');
    icon.className = classes;

    return icon;
}

function clearAll () {
        while (itemList.firstChild) {
            itemList.removeChild(itemList.firstChild);
        }

        clearUi ();
}

function clearUi () {
    const items = itemList.querySelectorAll('li');

    if (items.length === 0) {
        clearAllBtn.style.display = 'none'
        itemfilter.style.display = 'none';
    } else {
        clearAllBtn.style.display = 'block'
        itemfilter.style.display = 'block';
    }

    fromBtn.innerHTML = '<i class = "fa-solid fa-plus"></i> Add Item';
    fromBtn.style.backgroundColor = '#ad00ff';
    fromBtn.style.border = '#FF3FF7 solid 1px';

    itemInput.value = '';

    isEditMode = false;
    
};

function filterItems (e) {
    const items = itemList.querySelectorAll('li');
    const filterInputValue = e.target.value.toLowerCase();

    items.forEach((item) => {
       const itemText = item.firstChild.textContent.toLowerCase();

        if (itemText.includes(filterInputValue)) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none'
        }

        console.log(items.length);
    })

    
}

function onFocus () {
    itemInput.style.outline = '1px solid #ad00ff';
};

function onBlur () {
    itemInput.style.outline = '';
};

function addItemToStorage (item) {
    let itemsFromStorage = getItemsFromStorage();

    if (localStorage.getItem('items') === null) {
        itemsFromStorage = [];
    } else {
        itemsFromStorage = JSON.parse(localStorage.getItem('items'))
    }

    itemsFromStorage.push(item);

    // Convert array items back stringified array

    localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}




function getItemsFromStorage () {
    let itemsFromStorage ;

    if(localStorage.getItem('items') === null) {
        itemsFromStorage = [];
    } else {
        itemsFromStorage = JSON.parse(localStorage.getItem('items'))
    }
    return itemsFromStorage;
}




// AddEventListeners 
itemForm.addEventListener('submit', addItemOnSubmit);
itemInput.addEventListener('focus', onFocus);
itemInput.addEventListener('blur', onBlur);
itemList.addEventListener('click', onClickItem);
clearAllBtn.addEventListener('click', clearAll );
document.addEventListener('DOMContentLoaded', clearUi);
itemfilter.addEventListener('input',filterItems);
document.addEventListener('DOMContentLoaded', displayItems);





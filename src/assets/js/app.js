// Variables & targets:
const	body = document.getElementsByTagName('body');
const	alertDiv = document.querySelector('.alert');
const	form = document.querySelector('#form');
const 	inputGroup = document.querySelector('#input-group');
const	input = document.querySelector('#input');
const	close = document.querySelector('#close');
const	submitBtn = document.querySelector('#submit-btn');
const	checkAll = document.querySelector('#checkall');
const	tblContainer = document.querySelector('.table-container');
const	listContainer = document.querySelector('.list-container');
const	clearAllBtn = document.querySelector('#clear-all-btn');
const 	localStorageKey = "list";

const 	deleteModalContentContainer = document.querySelector('#delete-modal-content-container');
const 	deleteSingle = document.querySelector('#delete-single');

let 	editMode = false;
let 	editElement;
let 	editID;

// FUNCTIONS:

// 1. Alert messages
function alert(message, type) {

	alertDiv.classList.remove('hide');
	alertDiv.classList.add('alert-' + type);
	alertDiv.innerHTML = message;

	setTimeout(function() { // make disappear after 5 secs

		alertDiv.classList.add('hide');
		alertDiv.classList.remove('alert-' + type);

	}, 5000);
}

// 2. Render Item
function renderItem(id, name, date) {

	let tr = document.createElement('tr');
	tr.classList.add('list-item');
	tr.setAttribute('data-id', id);

		let td1 = document.createElement('td');
			let input1 = document.createElement('input');
			input1.classList.add('form-check-input', 'checkbox-row');
			input1.setAttribute('type', 'checkbox');
			input1.setAttribute('name', 'checkbox[]');
			input1.setAttribute('value', id);
			td1.appendChild(input1);
			tr.appendChild(td1);

		let td2 = document.createElement('td');
			td2.innerText = name;
			tr.appendChild(td2);

		let td3 = document.createElement('td');
			td3.textContent = date;
			tr.appendChild(td3)

		let td4 = document.createElement('td');
			let btn_edit = document.createElement('button');
			btn_edit.classList.add('btn', 'btn-sm', 'btn-edit');
			btn_edit.setAttribute('type', 'button');
			btn_edit.setAttribute('id', 'edit-' + id);
			let i_edit = document.createElement('i');
			i_edit.classList.add('fas', 'fa-edit');
			btn_edit.appendChild(i_edit);
			td4.appendChild(btn_edit);
			tr.appendChild(td4);

		let td5 = document.createElement('td');
			let btn_delete = document.createElement('button');
			btn_delete.classList.add('btn', 'btn-sm', 'btn-delete');
			btn_delete.setAttribute('type', 'button');
			btn_delete.setAttribute('id', 'delete-' + id);
			let i_delete = document.createElement('i');
			i_delete.classList.add('fa', 'fa-trash-o');
			btn_delete.appendChild(i_delete);
			td5.appendChild(btn_delete);
			tr.appendChild(td5);

	listContainer.insertBefore(tr, listContainer.firstChild);

	// edit
	let editSingle = document.querySelector('#edit-' + id);
	
	editSingle.addEventListener('click', function(e) {

		clearAllHighlights();

		setEditMode();

		alert(`Click the <strong>Save</strong> button to update changes`, 'info');

		editElement = e.target.parentElement.parentElement.parentElement;

		editID = editElement.dataset.id;

		editElement.classList.add('highlight');

		input.value = editElement.firstChild.nextSibling.textContent;
	});

	// delete
	let deleteModalBtn = document.querySelector('#delete-' + id);
	
	deleteModalBtn.addEventListener('click', function(e) {

		renderDeleteModalContent(id, name);

		deleteModalContentContainer.classList.add('open');
		
	});

	return tr;
}

// 3. Render delete modal
function renderDeleteModalContent(id, name) {

	const content = `<div class="card modol" data-id="${id}" data-name="${name}">
                
                <h5 class="card-header">
                    <span><i class="fa fa-trash-o"></i> Delete</span>
                    <button type="button" class="btn close-modal" onClick="closeModal();">
                        <i class="fas fa-close close-modal"></i>
                    </button>
                </h5>
                <div class="card-body">
                    <p class="mb-1">
                        Are you sure you want to delete <strong>${name}</strong>?
                    </p>
                    <small class="text-secondary mb-0">This action is NOT reversible</small>
                </div>
                <!-- /card-body -->
                
                <div class="card-footer text-end">
                    
                    <button type="button" class="btn btn-outline-secondary close-modal" onClick="closeModal();">
                        Cancel
                    </button>

                    <button type="submit" class="btn btn-danger" id="delete-single">
                        <i class="fa fa-trash-o"></i> Delete
                    </button>

                </div>
                <!-- /card-footer -->
            </div>
            <!-- /modol -->`;

	deleteModalContentContainer.innerHTML = content;
}

// 4. Close modal
function closeModal() {

	deleteModalContentContainer.classList.remove('open');
}

// 5. Load content from local storage
function loadContentFromLocalStorage() {

	// first empty the rendered content
	const listItems = document.querySelectorAll('.list-item');

	if(listItems.length > 0) {

		listItems.forEach(function(item) {

			item.parentElement.removeChild(item);

		});
	}

	// then get from local storage and re-render
	const itemsLS = getLocalStorage();

	if(itemsLS.length > 0) {

		itemsLS.forEach(function(item) {

			renderItem(item.id, item.name, item.date);
		});
	}
}

// 6. Reset form
function resetForm() {

	editMode = false;

	editElement = null;

	editID = null;

	input.value = "";

	submitBtn.innerHTML = `<i class="fas fa-plus"></i> Add`;
	
	inputGroup.classList.remove('edit-mode');

	clearAllHighlights();
}

// 7. Check Form
function checkList() {

	const listItems = document.querySelectorAll('.list-item');

	listItems.length > 0 ? tblContainer.classList.remove('hide') : tblContainer.classList.add('hide');
}

// 8. Set editMode
function setEditMode() {

	editMode = true;

	inputGroup.classList.add('edit-mode');

	submitBtn.innerHTML = `<i class="fas fa-save"></i> Save`;
}

// 9. Remove all highlights
function clearAllHighlights() {

	const listItems = document.querySelectorAll('.list-item');

	if(listItems.length > 0) {

		listItems.forEach(function(item) {

			item.classList.remove('highlight');

		});
	}
}

// 10. check all checkboxes
function checkAllBoxes() {

	const checkBoxes = document.querySelectorAll('.checkbox-row');
	const chckbxs = checkBoxes ? checkBoxes : [];

	chckbxs.forEach(function(item) {
		item.setAttribute('checked', 'checked');
	});
}

// 11. uncheck all checkboxes
function unCheckAllBoxes() {

	const checkBoxes = document.querySelectorAll('.checkbox-row');
	const chckbxs = checkBoxes ? checkBoxes : [];

	chckbxs.forEach(function(item) {
		item.removeAttribute('checked');
	});
}

// LOCAL STORAGE:

// 1. Add to local storage
function addToLocalStorage(object) {

	let array = getLocalStorage() ? getLocalStorage() : [];

	array.push(object);

	localStorage.setItem(localStorageKey, JSON.stringify(array));
}

// 2. Edit Local Storage
function editLocalStorage(id, editedName) {

	let array = getLocalStorage();

	array.map(function(item) {

		if(item.id === id) {

			item.name = editedName;
		}

		return item;
	});

	localStorage.setItem(localStorageKey, JSON.stringify(array));
}

// 3. delete from local storage
function deleteFromLocalStorage(id) {

	let oldArray = getLocalStorage();

	let array = oldArray.filter(function(item) {

		if(item.id !== id) {

			return item;
		}
	});

	localStorage.setItem(localStorageKey, JSON.stringify(array));
}

// 4. Get local storage
function getLocalStorage() {

	return localStorage.getItem(localStorageKey) ? JSON.parse(localStorage.getItem(localStorageKey)) : [];
}

// EVENT LISTENERS:

// 1. if form has been submitted
form.addEventListener('submit', function(e) {

	e.preventDefault(); // prevent page refresh upon click

	const id = new Date().getTime().toString();
	let name = input.value;
	const day = new Date().getDate();
	const month = new Date().getMonth();
	const year = new Date().getFullYear();
	const date = year + '-' + month + '-' + day;

	// SAVE mode
	if(name && !editMode) {
		
		// Save to local storage
		const object = {id: id, name: name, date: date}
		addToLocalStorage(object);

		// render on screen
		let tr = renderItem(id, name, date);
		tr.classList.add('table-light');
		
		setTimeout(function() {

			tr.classList.remove('table-light');

		}, 2000);

		resetForm();
		checkList();

		alert(`<strong>${name}</strong> added successfully`, 'success');
	
	// EDIT mode
	} else if(name && editMode) {

		let editedValue = input.value;
		let tr = editElement; 

		// update local storage
		editLocalStorage(editID, editedValue);

		// update DOM
		tr.firstChild.nextSibling.textContent = editedValue;
		tr.classList.add('table-light');

		setTimeout(function() {

			tr.classList.remove('table-light');

		}, 6000);

		resetForm();
		checkList();

		alert(`<strong>${editedValue}</strong> updated successfully`, 'success');

	// if value is empty
	} else {

		alert('Please fill the form', 'danger');
	}
});

// 2. If close button (EDIT MODE) has been clicked
close.addEventListener('click', function() {

	resetForm();
});

// 3. If the `clear entire list` button has been clicked
clearAllBtn.addEventListener('click', function() {

	const modalBackdrop = document.querySelector('.modal-backdrop');
	const deleteModal = document.querySelector('#clear-list-modal');
	const listItems = document.querySelectorAll('.list-item');

	if(listItems.length > 0) { // if there are items on the list

		listItems.forEach(function(item) {

			let id = item.dataset.id;

			deleteFromLocalStorage(id); // remove from local storage
			item.parentElement.removeChild(item); // remove from DOM
		});

		// hide modal
		// deleteModal.hide();
		deleteModal.classList.remove('show');
		deleteModal.removeAttribute('style');
		body[0].classList.remove('modal-open');
		modalBackdrop.parentNode.removeChild(modalBackdrop);

		alert('All names cleared from the list successfully', 'success');
		checkList();
		resetForm();
	}
});

// 4. If the delete button has been submitted
deleteModalContentContainer.addEventListener('submit', function(e) {

	e.preventDefault();

	const id = e.target.children[0].dataset.id;
	const name = e.target.children[0].dataset.name;

	// // remove from local storage
	deleteFromLocalStorage(id);

	// hide modal
	e.target.classList.remove('open');

	loadContentFromLocalStorage(); // get all records afresh and render to DOM

	alert('<strong>'+name+'</strong> has been deleted successfully', 'success');
	checkList();
	resetForm();
});

// 5. If the check all checkbox has been clicked
checkAll.addEventListener('input', function() {

	checkAllBoxes();
});

// 6. If the check all checkbox has been clicked
checkAll.addEventListener('focusout', function(e) {

	unCheckAllBoxes();
});

// RUN: 

// 1. if page has fully loaded
window.addEventListener('DOMContentLoaded', function() {

	// 1. load content
	loadContentFromLocalStorage();

	// 2. check list
	checkList();
});




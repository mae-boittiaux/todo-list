const databaseName = "todo-database";
const objectStoreName = "todo-store";

let database;

const request = indexedDB.open(databaseName, 1);

const isTodoChecked = [];

request.onerror = () => {
    console.error("[IndexedDB]: Error opening connection to database.");
};
request.onsuccess = (event) => {
    console.log("[IndexedDB]: Database connection opened successfully.");
    database = event.target.result;
    updateTodoList();
};

request.onupgradeneeded = (event) => {
    const database = event.target.result;
    const objectStore = database.createObjectStore(objectStoreName, { keyPath: 'id', autoIncrement: true });
    objectStore.createIndex("todo", "todo", { unique: false });
};

document.getElementById('todo-form').onsubmit = (event) => {
    event.preventDefault();

    const todoInput = document.getElementById('todo-input');
    const newTodo = { todo: todoInput.value };

    const transaction = database.transaction([objectStoreName], 'readwrite');
    const objectStore = transaction.objectStore(objectStoreName);
    const request = objectStore.add(newTodo);

    request.onsuccess = () => {
        console.log(`[IndexedDB]: To-do '${newTodo.todo}' added successfully to database.`);
        todoInput.value = '';
        updateTodoList();
    };
    request.onerror = () => {
        console.error("[IndexedDB]: Error adding item to database.");
    };
};

function updateTodoList() {
    const transaction = database.transaction([objectStoreName], 'readonly');
    const objectStore = transaction.objectStore(objectStoreName);
    const request = objectStore.getAll();

    request.onsuccess = (event) => {
        const storedTodos = event.target.result;
        const todoListElement = document.getElementById('todo-list');
        todoListElement.innerHTML = '';

        let itemCount = 0;

        storedTodos.forEach(todo => {
            const listItem = document.createElement('li');
            listItem.textContent = todo.todo;
            listItem.dataset.id = todo.id;

            isTodoChecked[todo.id] = false;

            const addCSS = css => document.head.appendChild(document.createElement("style")).innerHTML = css;

            if (localStorage.selectedTheme == 'button-0') {
                addCSS("#todo-list li::before{ background-color: #d5e3f0; }");
            }
            if (localStorage.selectedTheme == 'button-1') {
                addCSS("#todo-list li::before{ background-color: #e0d2ec; }");
            }
            if (localStorage.selectedTheme == 'button-2') {
                addCSS("#todo-list li::before{ background-color: #d6ebc5; }");
            }

            if (localStorage.selectedHighlighterColour == 'highlighter-yellow') {
                addCSS("::selection{ background-color: #ffee8cc0; }");
            }
            if (localStorage.selectedHighlighterColour == 'highlighter-pink') {
                addCSS("::selection{ background-color: #fb8cffc0; }");
            }
            if (localStorage.selectedHighlighterColour == 'highlighter-orange') {
                addCSS("::selection{ background-color: #ffc08cc0; }");
            }

            listItem.prepend(addCheckbox(todo));
            listItem.appendChild(addDeleteButton(todo));
            todoListElement.appendChild(listItem);
            itemCount++;
        });

        if (itemCount > 0) {
            const footerPadding = document.createElement('li');
            footerPadding.textContent = "";
            footerPadding.dataset.id = "";
            todoListElement.appendChild(footerPadding);
        }
        console.log("[IndexedDB]: To-do list updated successfully.");
    };
    request.onerror = () => {
        console.error("[IndexedDB]: Error updating the to-do list.");
    };
}

function addCheckbox(todo) {
    const label = document.createElement('label');
    label.className = 'container';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = false;

    const span = document.createElement('span');
    span.className = 'checkmark';

    label.appendChild(checkbox);
    label.appendChild(span);

    checkbox.onclick = () => {
        isTodoChecked[todo.id] = checkbox.checked;
        if (checkbox.checked == true) {
            console.log(`[Application]: To-do '${todo.todo}' completed!`);
        }
    };
    return label;
}

function addDeleteButton(todo) {
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.className = 'delete-button';

    deleteButton.onclick = () => {
        console.log(`[IndexedDB]: To-do '${todo.todo}' successfully deleted.`);
        deleteTodo(todo.id);
    };
    return deleteButton;
}

function deleteTodo(id) {
    const transaction = database.transaction([objectStoreName], 'readwrite');
    const objectStore = transaction.objectStore(objectStoreName);
    const request = objectStore.delete(id);

    request.onsuccess = () => {
        updateTodoList();
    };
    request.onerror = () => {
        console.error('[IndexedDB]: Error deleting to-do item.');
    };
}

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./service-worker.js')
        .then(function () {
            console.log("[Service Worker]: Registered successfully.");
        })
        .catch(function () {
            console.log("[Service Worker]: Registration failed.");
        })
}

const themeButtons = document.querySelectorAll('.colour-theme-button');

themeButtons.forEach(button => {
    button.addEventListener('click', () => {
        document.querySelector('.selected-theme')?.classList.remove('selected-theme');
        button.classList.add('selected-theme');
        updateTodoList();
    })
});

function setTheme(buttonName) {
    localStorage.selectedTheme = buttonName;
}

document.querySelector('.selected-theme')?.classList.remove('selected-theme');
themeButtons.forEach(button => {
    if (localStorage.selectedTheme == button.id) {
        document.getElementById(button.id).classList.add('selected-theme');
    }
});

const highlighterColour = document.querySelectorAll('.highlighter-colour-button');

highlighterColour.forEach(highlighter => {
    highlighter.addEventListener('click', () => {
        document.querySelector('.selected-highlighter')?.classList.remove('selected-highlighter');
        highlighter.classList.add('selected-highlighter');
        updateTodoList();
    })
});

function setHighlighterColour(buttonName) {
    localStorage.selectedHighlighterColour = buttonName;
}

document.querySelector('.selected-highlighter')?.classList.remove('selected-highlighter');
highlighterColour.forEach(highlighter => {
    if (localStorage.selectedHighlighterColour == highlighter.id) {
        document.getElementById(highlighter.id).classList.add('selected-highlighter');
    }
});
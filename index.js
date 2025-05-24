import { setEventListeners } from './event-listeners.js';
import { logMessage, MessageScope } from './log-message.js';

const databaseName = "todo-database";
const objectStoreName = "todo-store";

let database;

const request = indexedDB.open(databaseName, 1);

const addCSS = css => document.head.appendChild(document.createElement("style")).innerHTML = css;

setEventListeners();

request.onerror = () => {
    logMessage(MessageScope.INDEXEDDB, "Error opening connection to database");
};
request.onsuccess = (event) => {
    logMessage(MessageScope.INDEXEDDB, "Database connection opened successfully");
    database = event.target.result;
    checkDatabaseCount();
    updateTodoList();
};

request.onupgradeneeded = (event) => {
    const database = event.target.result;
    const objectStore = database.createObjectStore(objectStoreName, { keyPath: 'id', autoIncrement: true });

    objectStore.createIndex("todo", "todo", { unique: false });
    objectStore.createIndex("checked", "checked", { unique: false });
};

document.getElementById('todo-form').onsubmit = (event) => {
    event.preventDefault();

    const todoInput = document.getElementById('todo-input');
    const newTodo = { todo: todoInput.value, checked: false };

    const transaction = database.transaction([objectStoreName], 'readwrite');
    const objectStore = transaction.objectStore(objectStoreName);
    const request = objectStore.add(newTodo);

    request.onsuccess = () => {
        logMessage(MessageScope.INDEXEDDB, `To-do '${newTodo.todo}' added successfully to database`);
        todoInput.value = '';
        updateTodoList();
    };
    request.onerror = () => {
        logMessage(MessageScope.INDEXEDDB, "Error adding item to database");
    };
};

export function updateTodoList() {
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

            applyLineColour();
            applyHighlighterColour();
            applyBulletPoint(listItem);

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
        logMessage(MessageScope.INDEXEDDB, "To-do list updated successfully");
    };
    request.onerror = () => {
        logMessage(MessageScope.INDEXEDDB, "Error updating the to-do list");
    };
}

function applyBulletPoint(listItem) {
    if (localStorage.selectedBullet == 'bullet-none') {
        listItem.prepend("");
    }
    if (localStorage.selectedBullet == 'bullet-point') {
        listItem.prepend("• ");
    }
    if (localStorage.selectedBullet == 'bullet-dash') {
        listItem.prepend("- ");
    }
    if (localStorage.selectedBullet == 'bullet-arrow') {
        listItem.prepend("→ ");
    }
}

function applyLineColour() {
    if (localStorage.selectedTheme == 'line-blue') {
        addCSS("#todo-list li::before{ background-color: #d5e3f0; }");
    }
    if (localStorage.selectedTheme == 'line-purple') {
        addCSS("#todo-list li::before{ background-color: #e0d2ec; }");
    }
    if (localStorage.selectedTheme == 'line-green') {
        addCSS("#todo-list li::before{ background-color: #d6ebc5; }");
    }
}

function applyHighlighterColour() {
    if (localStorage.selectedHighlighterColour == 'highlighter-yellow') {
        addCSS("::selection{ background-color: #f5e497; }");
    }
    if (localStorage.selectedHighlighterColour == 'highlighter-pink') {
        addCSS("::selection{ background-color: #e7aed9; }");
    }
    if (localStorage.selectedHighlighterColour == 'highlighter-orange') {
        addCSS("::selection{ background-color: #ebc597; }");
    }
    if (localStorage.selectedHighlighterColour == 'highlighter-green') {
        addCSS("::selection{ background-color: #d1ecba; }");
    }
    if (localStorage.selectedHighlighterColour == 'highlighter-blue') {
        addCSS("::selection{ background-color: #c7dcf0; }");
    }
}

function addCheckbox(todo) {
    const label = document.createElement('label');
    label.className = 'container';

    const checkbox = document.createElement('input');
    checkbox.name = 'todo-checkbox';
    checkbox.type = 'checkbox';
    checkbox.checked = todo.checked;

    const span = document.createElement('span');
    span.className = 'checkmark';

    label.appendChild(checkbox);
    label.appendChild(span);

    checkbox.onclick = () => {
        const transaction = database.transaction([objectStoreName], 'readwrite');
        const objectStore = transaction.objectStore(objectStoreName);
        const request = objectStore.get(todo.id);

        request.onsuccess = (event) => {
            const todoItem = event.target.result;

            if (checkbox.checked == true) {
                todoItem.checked = true;
                const requestUpdate = objectStore.put(todoItem);
                requestUpdate.onsuccess = () => {
                    logMessage(MessageScope.APPLICATION, `To-do '${todo.todo}' completed`);
                };
            }
            if (checkbox.checked == false) {
                todoItem.checked = false;
                const requestUpdate = objectStore.put(todoItem);
                requestUpdate.onsuccess = () => { };
            }
        };
    };
    return label;
}

function addDeleteButton(todo) {
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.className = 'delete-button';

    deleteButton.onclick = () => {
        logMessage(MessageScope.INDEXEDDB, `To-do '${todo.todo}' successfully deleted`);
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
        logMessage(MessageScope.INDEXEDDB, "Error deleting to-do item");
    };
}

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./service-worker.js', { type: 'module' })
        .then(function () {
            logMessage(MessageScope.SERVICE_WORKER, "Registered successfully");
        })
        .catch(function () {
            logMessage(MessageScope.SERVICE_WORKER, "Registration failed");
        })
}

function checkDatabaseCount() {
    const transaction = database.transaction([objectStoreName], 'readonly');
    const objectStore = transaction.objectStore(objectStoreName);

    const countRequest = objectStore.count();
    countRequest.onsuccess = () => {
        if (countRequest.result == 0) {
            addIntroductionData();
        }
    };
}

function addIntroductionData() {
    const customerData = [
        { id: 1, todo: "How to use:", checked: false },
        { id: 2, todo: "1. Enter a to-do! (this will auto-clear).", checked: false },
        { id: 3, todo: "2. Change the line colour!", checked: false },
        { id: 4, todo: "3. Change the highlighter colour!", checked: false },
        { id: 5, todo: "4. Refresh the page and it will all persist!", checked: false },
    ];

    const customerObjectStore = database.transaction([objectStoreName], 'readwrite').objectStore(objectStoreName);
    customerData.forEach((customer) => {
        customerObjectStore.add(customer);
    });
    updateTodoList();
}

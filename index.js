const databaseName = "todo-database";
const objectStoreName = "todo-store";

let database;

const request = indexedDB.open(databaseName, 1);

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

        storedTodos.forEach(todo => {
            const listItem = document.createElement('li');
            listItem.textContent = todo.todo;
            listItem.dataset.id = todo.id;
            todoListElement.appendChild(listItem);
        });
        console.log("[IndexedDB]: To-do list updated successfully.");
    };
    request.onerror = () => {
        console.error("[IndexedDB]: Error updating the to-do list.");
    };
}

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
    };
    request.onerror = () => {
        console.error("[IndexedDB]: Error adding item to database.");
    };
};

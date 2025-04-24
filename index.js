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
    console.log("[IndexedDB]: Form submitted successfully.")
    todoInput.value = '';
};

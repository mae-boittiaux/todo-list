let database;

const request = indexedDB.open("todo-database", 1);

request.onerror = () => {
    console.error("[IndexedDB]: Error opening connection to database.");
};
request.onsuccess = (event) => {
    console.log("[IndexedDB]: Database connection opened successfully.");
    database = event.target.result;
};

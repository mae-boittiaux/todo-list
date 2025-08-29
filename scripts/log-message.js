export const MessageScope = Object.freeze({
    INDEXEDDB: "IndexedDB",
    APPLICATION: "Application",
    SERVICE_WORKER: "Service Worker"
});

function formatMessage(scope, message) {
    return `[${scope}]: ${message}.`;
}

function outputToConsole(scope, message) {
    console.log(formatMessage(scope, message));
}

export function logMessage(scope, message) {
    outputToConsole(scope, message);
}

const DATABASE_NAME = 'todo-app-db';
globalThis.DATABASE_NAME = DATABASE_NAME;

let openRequest = globalThis.indexedDB.open(DATABASE_NAME, 1);
openRequest.onupgradeneeded = handleUpgrade;

function handleUpgrade(event) {
    const db = event.target.result;
    if (!db.objectStoreNames.contains('notes')) {
        db.createObjectStore('notes', { keyPath: 'id' });
    }
}

const DB = {
    api: null,
    ready: null,
    c: null,
    r: null,
    u: null,
    d: null,
};

const reopenDb = async () => {
    return DB.ready;
};

function setup(DB, openRequest) {
    DB.ready = new Promise((resolve, reject) => {
        openRequest.onsuccess = (event) => {
            DB.api = event.target.result;
            onDbOpen(DB);
            resolve();
        };
        openRequest.onerror = (event) => {
            console.error("Failed to open database:", event.target.error);
            reject(event.target.error);
        };
    });
}

function onDbOpen(DB) {
    DB.api.onversionchange = () => {
        console.warn("Database version change detected. Closing database.");
        DB.api.close();
        reopenDb();
    };

    DB.api.onclose = () => {
        reopenDb();
    };

    DB.api.onerror = (event) => {
    };

    // Create (Insert or Update)
    DB.c = async (row) => {
        await DB.ready;
        return new Promise((resolve, reject) => {
            const transaction = DB.api.transaction("notes", "readwrite");
            transaction.onerror = (event) => {

            };
        });
    };

    // Read (Get by ID or Get All)
    DB.r = async (id) => {
        await DB.ready;
        if (id === undefined) {
            return dbReadAll(DB.api);
        }
        return dbReadById(DB.api, id);
    };

    // Update (Same as Create since `put` handles both insert and update)
    DB.u = async (row) => {
        console.log("Updating row:", row); // Debugging
        return DB.c(row); // Reuse the `c` function for updates
    };

    // Delete (By ID or All)
    DB.d = async (id) => {
        await DB.ready;
        if (id === undefined) {
            return dbDeleteAll(DB.api);
        }
        return dbDeleteById(DB.api, id);
    };
}

setup(DB, openRequest);

// Helper function to read all records
async function dbReadAll(api) {
    return new Promise((resolve, reject) => {
        const transaction = api.transaction('notes', 'readonly');
        transaction.onerror = (event) => {
            console.error("Transaction error during read all:", event.target.error);
        };
        const store = transaction.objectStore('notes');
        const request = store.getAll();
        request.onsuccess = (event) => resolve(event.target.result);
        request.onerror = (event) => {
            console.error("Failed to read all records:", event.target.error);
            reject(event.target.error);
        };
    });
}

// Helper function to read a record by ID
async function dbReadById(api, id) {
    return new Promise((resolve, reject) => {
        const transaction = api.transaction('notes', 'readonly');
        transaction.onerror = (event) => {
            console.error("Transaction error during read by ID:", event.target.error);
        };
        const store = transaction.objectStore('notes');
        const request = store.get(id);
        request.onsuccess = (event) => resolve(event.target.result);
        request.onerror = (event) => {
            console.error(`Failed to read record with ID ${id}:`, event.target.error);
            reject(event.target.error);
        };
    });
}

// Helper function to delete all records
async function dbDeleteAll(api) {
    return new Promise((resolve, reject) => {
        const transaction = api.transaction('notes', 'readwrite');
        transaction.onerror = (event) => {
            console.error("Transaction error during delete all:", event.target.error);
        };
        const store = transaction.objectStore('notes');
        const request = store.clear();
        request.onsuccess = () => resolve();
        request.onerror = (event) => {
            console.error("Failed to delete all records:", event.target.error);
            reject(event.target.error);
        };
    });
}

// Helper function to delete a record by ID
async function dbDeleteById(api, id) {
    return new Promise((resolve, reject) => {
        const transaction = api.transaction('notes', 'readwrite');
        transaction.onerror = (event) => {
            console.error("Transaction error during delete by ID:", event.target.error);
        };
        const store = transaction.objectStore('notes');
        const request = store.delete(id);
        request.onsuccess = () => resolve();
        request.onerror = (event) => {
            console.error(`Failed to delete record with ID ${id}:`, event.target.error);
            reject(event.target.error);
        };
    });
}

// Export DB and reopenDb after initialization
export default DB;
export { reopenDb };
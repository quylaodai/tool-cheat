
export class Database {
    static isInit = false;
    constructor(config) {
        this._config = config;
        this.onload = null;
        if (Database.isInit) return this._initApp();
        Database.isInit = true;
        this.loadFirebaseScripts()
        .then(() => this._initApp())
        .catch(error => console.error("Error loading Firebase scripts:", error));
    }

    loadFirebaseScripts() {
        const scripts = [
            "https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js",
            "https://www.gstatic.com/firebasejs/8.10.1/firebase-auth.js",
            "https://www.gstatic.com/firebasejs/8.10.1/firebase-firestore.js",
            "https://www.gstatic.com/firebasejs/8.10.1/firebase-database.js"
        ];
        return scripts.reduce((promise, src) => {
            return promise.then(() => this.loadScript(src));
        }, Promise.resolve());
    }

    loadScript(src) {
        return new Promise((resolve, reject) => {
            const script = document.createElement("script");
            script.src = src;
            script.onload = resolve;
            script.onerror = reject;
            document.body.appendChild(script);
        });
    }
    _initApp() {
        const firebase = window.firebase;
        if (!firebase) {
            console.error("Firebase is not available on the window object.");
            return 
        }
        this.app = firebase.initializeApp(this._config);
        if (this.app) {
            this._db = this.app.database();
        }
        console.log("Init DB success", this._db);
        this.onload && this.onload();
    }
    async getDataPath(path) {
        if (!this._db) return;
        return this._db.ref(path).once('value')
            .then(snapshot => {
                return snapshot.val();
            })
            .catch(error => {
                console.error("Error getting data:", error);
                throw error;
            });
    }
    async setDataPath(path, data) {
        return this._db.ref(path).set(data)
            .catch(error => {
                console.error("Error uploading data:", error);
                throw error;
            });
    }
    async pushToPath(path, data) {
        if (!this._db) return null;
        return this._db.ref(path).push(data)
            .then(() => {
                console.log(`Data added to ${path}`);
            })
            .catch(error => {
                console.error("Error adding data:", error);
                throw error;
            });
    }
    async clearDataByPath(path) {
        if (!this._db) return null;
        return this._db.ref(path).remove()
            .then(() => {
                console.log(`Removed data from ${path}`);
            })
            .catch(error => {
                console.error("Error delete data:", error);
                throw error;
            });
    }
    async getAllData() {
        return this.getDataPath("/");
    }
}

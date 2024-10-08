import { apiUrl, firebaseConfig } from "./env.js";
import { Database } from "./Database.js";

export class ToolCheat {

    constructor() {
        this.gameId = "9877";
        this.userId = "game_user166";
        this._db = new Database(firebaseConfig);
        this._db.onload = () => {
            this.start();
        }
    }
    start() {
        this.initGui();
    }
    initGui() {
        const gui = new dat.GUI({ width: 250 });
        const folder = gui.addFolder("Input Data");
        folder.open();
        folder.add(this, "gameId");
        folder.add(this, "userId");
        folder.add(this, "loadForm");
        folder.add(this, "getData");
    }

    loadForm() {
        const inputUrl = `${apiUrl}/${this.gameId}/inputdata`;
        const xhr = new XMLHttpRequest();
        xhr.open('GET', inputUrl, true);
        xhr.onreadystatechange = () => {
            if (xhr.readyState == 4) {
                if (xhr.responseText) {
                    this._showForm(xhr.responseText)
                }
            }
        }
        xhr.send();
    }
    _showForm(responseText) {
        const form = document.createElement("div");

        document.body.append(form);
        form.innerHTML = responseText;
    }
   
    async getData(gameId, userId){
        gameId = gameId || this.gameId;
        userId = userId || this.userId;
        const path = `${gameId}/${userId}`
        let data = await this._db.getDataPath(path);
        if (!data) data = this.createData(path);
        console.error(data);
        return data;
    }
    async createData(gameId, userId){
        const path = `${gameId}/${userId}`
        const data = await this._db.setDataPath(path, {});
    }
}

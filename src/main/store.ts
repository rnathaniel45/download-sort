import { access } from "node:fs/promises";
import { is } from "@electron-toolkit/utils";
import { resolve } from "node:path";
const Store = require("electron-store").default;
interface GlobalConfig {
    folders: {path: string, desc: string}[]
};

const store = new Store({
    defaults: {
        folders: []
    }
});

const folders: GlobalConfig["folders"] = store.get("folders");

for (let i = 0; i < folders.length; ++i) {
    access(folders[i].path).catch(() => { folders.splice(i, 1); });
}

function addFolder(path: string, desc: string): void {
    if (!folders.find(folder => resolve(folder.path) === resolve(path))) {
        folders.push({path, desc});
        store.set("folders", folders);
    }
}
function changedesc(path: string, desc: string): void {
    if(folders.find(folder => resolve(folder.path) === resolve(path))) {
        folders.filter(folder => resolve(folder.path) !== resolve(path));
        folders.push({path, desc});
        store.set("folders", folders);
    }
}
function removeFolder(path: string): void {
    const indice = folders.findIndex(folder => resolve(folder.path) === resolve(path));

    if (indice !== -1) {
        folders.splice(indice, 1);
        store.set("folders", folders);
    }
}

export { folders as default, addFolder, removeFolder, changedesc};

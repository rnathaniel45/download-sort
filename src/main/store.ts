import { access } from "node:fs/promises";
import { is } from "@electron-toolkit/utils";
import { resolve } from "node:path";
const Store = require("electron-store").default;
interface GlobalConfig {
    folders: {path: string, desc: string}[]
    monitor: string
};

const store = new Store({
    defaults: {
        folders: [],
        monitor: ''
    }
});

const folders: GlobalConfig["folders"] = store.get("folders");
const monitor: GlobalConfig["monitor"] = store.get("monitor");
for (let i = 0; i < folders.length; ++i) {
    access(folders[i].path).catch(() => { folders.splice(i, 1); });
}

function addMonitor(path: string): void {
    store.set("monitor", path);
}
function addFolder(path: string, desc: string): void {
    if (!folders.find(folder => resolve(folder.path) === resolve(path))) {
        folders.push({path, desc});
        store.set("folders", folders);
    }
}
function changedesc(path: string, desc: string): void {
    const indice = folders.findIndex(folder => resolve(folder.path) === resolve(path));

    if (indice !== -1) {
        folders[indice].desc = desc;
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
export { folders as default, addFolder, removeFolder, changedesc, addMonitor, monitor};

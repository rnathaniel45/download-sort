import Store from "electron-store";

const store = new Store();
store.set("folders",[])

function addFolder(topic:string){
    const folders = store.get("folders") as string[];
    if(!folders.includes(topic)){
        folders.push(topic);
    }
}
export default store;

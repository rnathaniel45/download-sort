import Versions from "./components/Versions";
import electronLogo from "./assets/electron.svg";
import React, { useEffect, useState } from "react";
import folderpic from "./public/folder.png"
import gradient2 from "./public/gray.jpg"
import wisewolf from "./public/wisewolf.webp"
import Popup from "./popup";
function App(): React.JSX.Element {
    async function fetchFolders() {
        try {
          // Invoke main process to get folders
          const folderArray = await window.electron.ipcRenderer.invoke("getFolders");
          setFolders(folderArray);
        } catch (error) {
          console.error("Failed to get folders:", error);
        }
      }
    
    const addFolder = async (): Promise<void> => window.electron.ipcRenderer.invoke("addFolder").then(() => fetchFolders());
    const removeFolder = async (v: string): Promise<void> => window.electron.ipcRenderer.invoke("removeFolder", v).then(() => fetchFolders());
    const addMonitor = async (): Promise<void> => window.electron.ipcRenderer.invoke("addMonitor").then((v) => {
        setMonitors(v);
    });
    const removeMonitor = async (): Promise<void> => window.electron.ipcRenderer.invoke("removeMonitor").then(() => getMonitor());
    const getFolders = async (): Promise<void> => {
        const folders = await window.electron.ipcRenderer.invoke("getFolders");
        console.log(folders);
    };
    const getMonitor = async (): Promise<void> => {
        const monitors = await window.electron.ipcRenderer.invoke("getMonitor");
        setMonitors(monitors);
    };
    const [showPopup, setShowPopup] = useState(false);
    const changeDesc = async (v: string, a: string): Promise<void> => window.electron.ipcRenderer.invoke("changeDesc", v, a).then(() => fetchFolders());
    const [folders, setFolders] = useState([]);
    const [monitors, setMonitors] = useState([]);
    
    useEffect(() => {
      fetchFolders();
      getMonitor();
    }, []);
    return (
        <>
        <div style = {{backgroundImage: `url(${wisewolf})`, backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat", backgroundAttachment: "fixed",  height: "100vh",  // add this line
    overflowY: "auto"}}>
         <div style={{display: "flex", flexDirection: "row", flexWrap: "wrap", gap: "16px", alignItems:"flex-start", justifyContent:"flex-start", verticalAlign: "top", position: "relative", top: "0", left: "0", right: "0", bottom: "0"}}>
      {folders.length === 0 ? (
        <p>No folders available</p>
      ) : (
        folders.map((folder: {path: string, desc: string}) => (
          <div
            key={folder.path}
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: 8,
              cursor: "pointer",
              fontFamily: "sans-serif",
              fontSize: 16,
              userSelect: "none",
              flexDirection: "column",
              border: "1px solid #ccc",
              borderRadius: 8,
              padding: 8,
              boxSizing: "border-box",
              gap: "8px"
            }}
          >
            <img src = {folderpic} alt="folder" style = {{width: "100px", height: "auto"}} />
            <span style = {{fontSize: "12px"}}>{folder.path}</span>
            <span style = {{display: "flex", flexDirection: "row", gap: "8px"}}>    
                <button onClick={() => removeFolder(folder.path)}>Remove</button>
                <Popup folder={folder.path} changeDesc={changeDesc} desc = {folder.desc}/>
            </span>
          </div>
        ))
      )}
    </div>
        <div style={{
    position: "absolute",
    bottom: "0",
    right: "0",
    width: "100%",     
    padding: "16px",
    backgroundColor: "white",
    boxShadow: "0 -2px 5px rgba(0,0,0,0.1)",
    display: "flex",
    justifyContent: "flex-end",
    gap: "16px",
    backgroundImage: `url(${gradient2})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundAttachment: "fixed",
    borderRadius: "10px",
    opacity: "0.8"
  }}>
          <p  style={{ color: "black", fontFamily: "Noto Sans"}}>{monitors}</p>
          <button style = {{fontFamily: "Roboto", width: "100px", height: "30px", borderRadius: "5px", border: "1px solid #ccc", padding: "5px", boxSizing: "border-box"}} onClick={addFolder}>Add Folder</button>
            <button style = {{fontFamily: "Roboto", width: "100px", height: "30px", borderRadius: "5px", border: "1px solid #ccc", padding: "5px", boxSizing: "border-box"}} onClick={addMonitor}>Add Monitor</button>
            <button style = {{fontFamily: "Roboto", borderRadius: "5px", border: "1px solid #ccc", padding: "5px", boxSizing: "border-box"}} onClick={removeMonitor}>Remove Monitor</button>
  </div>
  </div>

        </>
    );
}

export default App;

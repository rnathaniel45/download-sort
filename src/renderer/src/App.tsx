import Versions from "./components/Versions";
import electronLogo from "./assets/electron.svg";
import React, { useEffect, useState } from "react";
import folderpic from "./public/folder.png"
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
    const addMonitor = (): void => window.electron.ipcRenderer.send("addMonitor");
    const getFolders = async (): Promise<void> => {
        const folders = await window.electron.ipcRenderer.invoke("getFolders");
        console.log(folders);
    };
    
    const [folders, setFolders] = useState([]);
  
    useEffect(() => {
      fetchFolders();
    }, []);
    return (
        <>
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
            <button onClick={() => removeFolder(folder.path)}>Remove</button>
          </div>
        ))
      )}
    </div>
        <div style = {{display: "flex", flexDirection: "row", flexWrap: "wrap", gap: "16px", alignItems:"center", justifyContent:"center", verticalAlign: "top", position: "relative", top: "0", left: "0", right: "0", bottom: "0"}}>
            <button onClick={addFolder}>Add Folder</button>
            <button onClick={addMonitor}>Add Monitor</button>
        </div>
           
            <Versions></Versions> 
        </>
    );
}

export default App;

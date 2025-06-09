import Versions from "./components/Versions";
import electronLogo from "./assets/electron.svg";
import React, { useEffect, useState } from "react";

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
    const removeFolder = (): void => window.electron.ipcRenderer.send("removeFolder");
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
         <div style={{ padding: 12 }}>
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
              userSelect: "none"
            }}
          >
            <span role="img" aria-label="folder" style={{ marginRight: 8 }}>
              📁
            </span>
            <span>{folder.path}</span>
          </div>
        ))
      )}
    </div>
        <div>
            <button onClick={addFolder}>Add Folder</button>
            <button onClick={removeFolder}>Remove Folder</button>
            <button onClick={addMonitor}>Add Monitor</button>
            <button onClick={getFolders}>Get Folders</button>
        </div>
           
            <Versions></Versions> 
        </>
    );
}

export default App;

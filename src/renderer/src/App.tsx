import Versions from "./components/Versions";
import electronLogo from "./assets/electron.svg";

function App(): React.JSX.Element {
    const ipcHandle = (): void => window.electron.ipcRenderer.send("ping");
    const addFolder = (): void => window.electron.ipcRenderer.send("addFolder");
    const removeFolder = (): void => window.electron.ipcRenderer.send("removeFolder");
    const addMonitor = (): void => window.electron.ipcRenderer.send("addMonitor");
    return (
        <><div>
            <button onClick={addFolder}>Add Folder</button>
            <button onClick={removeFolder}>Remove Folder</button>
            <button onClick={addMonitor}>Add Monitor</button>
        </div>
           
            <Versions></Versions>
        </>
    );
}

export default App;

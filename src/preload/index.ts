import { contextBridge } from "electron";
import { electronAPI } from "@electron-toolkit/preload";

// Custom APIs for renderer
const api = {
    versions: {
        node: () => process.versions.node,
        chrome: () => process.versions.chrome,
        electron: () => process.versions.electron
    }
};

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
    try {
        contextBridge.exposeInMainWorld("electron", {
            ...electronAPI,
            process: {
                versions: {
                    node: process.versions.node,
                    chrome: process.versions.chrome,
                    electron: process.versions.electron
                }
            }
        });
        contextBridge.exposeInMainWorld("api", api);
    } catch (error) {
        console.error(error);
    }
} else {
    // @ts-ignore (define in dts)
    window.electron = {
        ...electronAPI,
        process: {
            versions: {
                node: process.versions.node,
                chrome: process.versions.chrome,
                electron: process.versions.electron
            }
        }
    };
    // @ts-ignore (define in dts)
    window.api = api;
}

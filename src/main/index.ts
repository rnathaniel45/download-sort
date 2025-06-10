import { app, shell, BrowserWindow, ipcMain } from "electron";
import path, { join, basename } from "path";
import { electronApp, optimizer, is } from "@electron-toolkit/utils";
import icon from "../../resources/icon.png?asset";
import compare from "./compare.py?asset";
import { addFile, watchFolder } from "./fileHandler";
import { moveFile } from "./movefile";
import { constantFile } from "./fileHandler";
import folders, { addFolder, addMonitor, changedesc, getFolders, getMonitor, monitor, removeFolder } from "./store";
import { spawn } from "child_process";

let mainWindow: BrowserWindow;

function createWindow(): void {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 900,
        height: 670,
        show: false,
        autoHideMenuBar: true,
        ...(process.platform === "linux" ? { icon } : {}),
        webPreferences: {
            preload: join(__dirname, "../preload/index.mjs"),
            sandbox: false,
            contextIsolation: true,
            nodeIntegration: false
        }
    });

    mainWindow.on("ready-to-show", () => {
        mainWindow.show();
    });

    mainWindow.webContents.setWindowOpenHandler((details) => {
        shell.openExternal(details.url);
        return { action: "deny" };
    });

    // HMR for renderer base on electron-vite cli.
    // Load the remote URL for development or the local html file for production.
    if (is.dev && process.env["ELECTRON_RENDERER_URL"]) {
        mainWindow.loadURL(process.env["ELECTRON_RENDERER_URL"]);
    } else {
        mainWindow.loadFile(join(__dirname, "../renderer/index.html"));
    }
}

function activateMonitor(): void {
    console.trace();
    console.log("Watching monitor path:", getMonitor());
    watchFolder(getMonitor(), (name => {
        console.log("File added: %s", name);           
        console.log("Folders:", getFolders());
        constantFile(getMonitor() + "/" + name).then(v => {
            console.log("File moved: %s", name);
            const child = spawn( "/Users/colinxu2006/.pyenv/shims/python3", [compare, v, JSON.stringify(getFolders())]);

            child.stdout.on("data", (data) => {
                console.log(`stdout: ${data}`);
                const str = data.toString().trim();

                moveFile(v, str);
            });

            child.stderr.on("data", (data) => {
                console.error(`stderr: ${data}`);
            });
        });
    }))
}
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
    // Set app user model id for windows
    electronApp.setAppUserModelId("com.electron");

    // Default open or close DevTools by F12 in development
    // and ignore CommandOrControl + R in production.
    // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
    app.on("browser-window-created", (_, window) => {
        optimizer.watchWindowShortcuts(window);
    });

    // IPC test
    ipcMain.on("ping", () => console.log("pong"));
    createWindow();
    ipcMain.handle("addFolder", async () => {
        try {
            const v = await addFile();          // wait for addFile to finish
            await addFolder(v, path.basename(v));  // wait for addFolder to finish
            return true;                       // send success back
          } catch (e) {
            console.error(e);
            return false;                      // send failure back
          }
    });
    ipcMain.handle("removeFolder", async (event, v: string) => {
        try {
            await removeFolder(v);  // wait for addFolder to finish
            return true;                       // send success back
          } catch (e) {
            console.error(e);
            return false;                      // send failure back
        }
    });
    ipcMain.on("addMonitor", () => {
        addFile() .then(v => {
            addMonitor(v); 
            activateMonitor();
        })
        .catch(console.error);
    });
    ipcMain.handle("changeDesc", async (event, v: string, a: string) => {
        try{
            await changedesc(v, a);
            return true;
        } catch (e) {
            console.error(e);
            return false;
        }
    });
    ipcMain.handle("getFolders", () => {
        return getFolders();
    });
    activateMonitor();
    app.on("activate", function () {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

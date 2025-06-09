import chokidar, { FSWatcher } from "chokidar";
import { dialog } from "electron";
import { stat } from 'fs/promises';
import path from "path";
let watcher: FSWatcher | null = null;

async function addFile(): Promise<string> {
    const filePath = (
        await dialog.showOpenDialog({
            title: "Choose a folder",
            properties: ["openDirectory"]
        })
    )?.filePaths[0];

    if (!filePath)
        throw new Error("Dialog closed");

    return filePath;
}

interface watchResponse {
    readonly success: boolean,
    readonly abort?: AbortController
};
function stopWatch(): void {
    if (watcher) {
        watcher.close();
        watcher = null;
    }
}
type watchCallback = (fileName: string) => void;

function watchFolder(filePath: string, callback: watchCallback): void {
    stopWatch();
    watcher = chokidar.watch(filePath, {
        ignoreInitial: true,
        awaitWriteFinish: {
            stabilityThreshold: 2000,
            pollInterval: 100
        }
    });
    watcher.on('add', async (fullPath) => {
        try {
            await constantFile(fullPath);
            callback(path.basename(fullPath));
        } catch (error) {
            console.error(`Error processing file ${fullPath}: ${(error as Error).message}`);
            }
        });
    watcher.on('error', (error) => {
        console.error(`Error watching ${filePath}: ${(error as Error).message}`);
    });
}

async function constantFile(fileName: string, interval: number = 500, maxTries: number = 10): Promise<string> {
    let recentsize = -1;

    for (let i = 0; i < maxTries; i++) {
        try {
            const Filestat = await stat(fileName);

            if (Filestat.size === recentsize) {
                console.log("File is constant");
                return fileName;
            }

            recentsize = Filestat.size;
        } catch (error) {
            console.error(`Failed to get size of ${fileName}: ${(error as Error).message}`);
        }

        await new Promise(resolve => setTimeout(resolve, interval));
    }

    throw new Error(`Failed to get size of ${fileName}: retries (${maxTries}) exhausted`);
}

export { addFile, watchFolder, constantFile };

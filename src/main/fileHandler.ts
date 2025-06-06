import { dialog } from "electron";
import { FSWatcher,watch} from 'fs';
import { stat } from 'fs/promises';
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

async function watchFolder(filePath: string, callback: watchCallback): Promise<watchResponse> {
    stopWatch();
    try {
        watcher = watch(filePath, (eventType, filename) => {
            if (eventType === "change"  && filename) {
                callback(filename);
            }
        });
    } catch (error) {
        throw new Error(`Failed to init watch (${filePath}): ${(error as Error).message}`);
    }

    return { success: true };
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

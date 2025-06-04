import { dialog } from "electron";
import * as fs from "node:fs/promises";
import path from "node:path";
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

type watchCallback = (fileName: string) => void;

async function watchFolder(filePath: string, callback: watchCallback): Promise<watchResponse> {
    const abort = new AbortController();

    try {
        const watcher = fs.watch(filePath, { signal: abort.signal });

        (async () => {
            for await (const event of watcher) {
                if (event.eventType === "rename" && event.filename) {
                    const fullPath = path.join(filePath, event.filename);

                    try {
                        await fs.access(fullPath);
                        callback(event.filename);
                    } catch { ; }
                }
            }
        })().catch(error => console.error(`Aborting watch (${filePath}): ${(error as Error).message}`)); //CHANGE TO IPC
    } catch (error) {
        console.error(`Failed to init watch (${filePath}): ${(error as Error).message}`);
        return { success: false };
    }

    return { success: true, abort };
}

async function constantFile(fileName: string, interval: number = 500, maxTries: number = 10): Promise<string> {
    let recentsize = -1;

    for (let i = 0; i < maxTries; i++) {
        try {
            const stat = await fs.stat(fileName);

            if (stat.size === recentsize) {
                console.log("File is constant");
                return fileName;
            }

            recentsize = stat.size;
        } catch (error) {
            console.error(`Failed to get size of ${fileName}: ${(error as Error).message}`);
        }

        await new Promise(resolve => setTimeout(resolve, interval));
    }

    throw new Error(`Failed to get size of ${fileName}: retries (${maxTries}) exhausted`);
}

export { addFile, watchFolder, constantFile };

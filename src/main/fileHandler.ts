import { dialog } from "electron";
import * as fs from "node:fs/promises";

async function addFile(): Promise<string> {
    const filePath: string = (
        await dialog.showOpenDialog({
            title: "Choose a folder",
            properties: ["openDirectory"]
        })
    ).filePaths[0];

    return filePath;
}

interface watchResponse {
    readonly success: boolean,
    readonly abort?: AbortController
};

type watchCallback = (fileName: string) => void;

async function watchFolder(filePath: string, callback: watchCallback): Promise<watchResponse> {
    const abort: AbortController = new AbortController();

    try {
        const watcher = fs.watch(filePath, { signal: abort.signal });

        (async () => {
            for await (const event of watcher)
                if (event.eventType === "rename" && event.filename)
                    callback(event.filename);
        })().catch(error => console.error(`Aborting watch (${filePath}): ${(error as Error).message}`)); //CHANGE TO IPC
    } catch (error) {
        console.error(`Failed to init watch (${filePath}): ${(error as Error).message}`);
        return { success: false };
    }

    return { success: true, abort };
}

export { addFile, watchFolder };

import fs from "fs";
import path from "path";

async function moveFile(sourceFile: string, destinationFolder: string) {

    // Destination file path (combine folder + filename)
    const filename = path.basename(sourceFile);
    const destinationFile = path.join(destinationFolder, filename);

    // Move the file
    fs.rename(sourceFile, destinationFile, (err) => {
    if (err) {
        console.error("Error moving file:", err);
    } else {
        console.log("File moved successfully!");
    }
    });
}

export { moveFile };
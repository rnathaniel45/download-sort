import { readFileSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import { is } from "@electron-toolkit/utils";

let configPath: string;

if (is.dev) {
    configPath = process.cwd();
} else {
    throw new Error("No");
    configPath = ""; //%APPDATA%?
}

configPath = join(configPath, "downloadSortConfig");

if (!existsSync(configPath)) {
    mkdirSync(configPath);
}

configPath = join(configPath, "config.json");

if (!existsSync(configPath)) {
    writeFileSync(configPath, "{}");
}

let config: object; //make interface later
config = JSON.parse(readFileSync(configPath, { encoding: "utf8" }));

function saveConfig(): Promise<void> {
    return writeFile(configPath, JSON.stringify(config));
}

export default config;
export { saveConfig };

import * as fs from "fs";

type CallbackFunction = {
    (err: NodeJS.ErrnoException|null, data: Buffer): void;
}

// Reading list from json file
exports.parseFile = function(callback: CallbackFunction) {
    fs.readFile("./wordsList.json", callback);
};
import * as fs from "fs";

type CallbackFunction = {
    (data: Buffer): void;
}

// Reading list from json file
export default module.exports = {
    parseFile: function(callback: CallbackFunction) {
        fs.readFile("src/consts/wordsList.json", function(err: NodeJS.ErrnoException|null, data: Buffer) {
            if (err) {
                throw err;
            }
            callback(data);
        });
    }
};
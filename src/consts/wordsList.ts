import * as fs from "fs";
import config from "./config";

type CallbackFunction = {
    (data: Buffer): void;
}

// Reading list from json file
export default module.exports = {
    parseFile: function(callback: CallbackFunction) {
        fs.readFile(config.ROOT_DIRECTORY + "consts/wordsList.json", function(err: NodeJS.ErrnoException|null, data: Buffer) {
            if (err) {
                throw err;
            }
            callback(data);
        });
    }
};
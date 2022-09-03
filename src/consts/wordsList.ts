import * as fs from "fs";

type CallbackFunction = {
    (data: Buffer): void;
}

export default module.exports = {
    parseFile: function(callback: CallbackFunction) {
        fs.readFile("src/consts/wordsList.json", function(err, data) {
            if (err) {
                console.log(err);
                return;
            }
            callback(data);
        });
    }
};

// Reading list from json file
// export default exports.parseFile = function(callback: CallbackFunction) {
//     fs.readFile("./wordsList.json", callback);
// };
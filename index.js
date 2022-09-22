const { getAllFilePathsWithExtension, readFile } = require("./fileSystem");
const { readLine } = require("./console");

const files = getFiles();
const TODOs = files.map((file) => file.match(/\/\/ TODO .*/g)).flat(Infinity);

console.log("Please, write your command!");
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), "js");
    return filePaths.map((path) => readFile(path));
}

function processCommand(command) {
    switch (command) {
        case "exit":
            process.exit(0);
        case "show":
            TODOs.forEach((element) => {
                console.log(element);
            });
            break;
        case "important":
            TODOs.filter((item) => item.includes("!")).forEach((x) =>
                console.log(x)
            );
            break;
        default:
            console.log("wrong command");
            break;
    }
}

// TODO you can do it!

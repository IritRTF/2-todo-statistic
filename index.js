const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function readLines(file){
    return file.split("\r\n");
}

function findTODO(lines){
    let TODOs = [];
    lines.forEach(line => {
        if (line.includes("// TODO "))
           TODOs.push(line.split("// TODO ")[1]);
    });
    return TODOs;
}

function processTODOs(TODOs){
    let processedTODOs = [];
    TODOs.forEach(TODO => {
        let splitedTODO = TODO.split("; ");
        processedTODOs.push({name : splitedTODO[0], 
                             date : splitedTODO[1], 
                             comment : splitedTODO[2]});
    });
    return processedTODOs;
}

function processCommand(command) {
    switch (command) {
        case 'exit':
            process.exit(0);
            break;
        case 'test':
            console.log(processTODOs(findTODO(readLines(getFiles()[0]))));
            break;
        default:
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!

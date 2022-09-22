const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();
const TODOs = findAllTODOs();

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
        if (line.includes("// TODO ") && !line.includes('\"// TODO \"'))
           TODOs.push(line.split("// TODO ")[1]);
    });
    return TODOs;
}

function processTODOs(TODOs){
    let processedTODOs = [];
    TODOs.forEach(TODO => {
        let splitedTODO = TODO.split("; ");
        let importanc = 0;
        splitedTODO[2].split("").forEach( ch => { if (ch === '!') importanc += 1;});
        processedTODOs.push({name : splitedTODO[0], 
                             date : splitedTODO[1], 
                             comment : splitedTODO[2],
                             importance : importanc});
    });
    return processedTODOs;
}

function findAllTODOs(){
    let TODOs = [];
    let files = getFiles();
    files.forEach(file => {
        processTODOs(findTODO(readLines(file))).forEach( TODO => TODOs.push(TODO));
    })
    return TODOs;
}

function processCommand(command) {
    switch (command) {
        case 'exit':
            process.exit(0);
            break;
        case 'test':
            console.log(TODOs);
            break;
        default:
            console.log('wrong command');
            break;
    }
}



const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

let longestName = 6;
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

        (splitedTODO.length === 1 ? splitedTODO[0] : splitedTODO[2])
            .split("").forEach( ch => { if (ch === '!') importanc += 1;});

        let nameLength = (splitedTODO.length === 1
            ? 'NaN' : splitedTODO[0]).length;
        if (nameLength > longestName)
            longestName = nameLength;

        processedTODOs.push({name : splitedTODO.length === 1 ? 'NaN' : splitedTODO[0].toLowerCase(),
            date : splitedTODO.length === 1 ? 'NaN' : new Date(splitedTODO[1]),
            comment : splitedTODO.length === 1 ? splitedTODO[0] : splitedTODO[2],
            importance : importanc});
    });
    if (longestName > 10)
        longestName = 10;
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

// Команды

function show(){
    printTitle();
    TODOs.forEach(TODO => beautifulPrint(TODO));
    console.log("-".repeat(100));

}

function important(){
    printTitle();
    TODOs.forEach(TODO => {if (TODO['importance'] > 0) beautifulPrint(TODO)});
    console.log("-".repeat(100));
}

function important(){
    printTitle();
    TODOs.forEach(TODO => {if (TODO['importance'] > 0) beautifulPrint(TODO)});
    console.log("-".repeat(100));
}

function user(name){
    printTitle();
    TODOs.forEach(TODO => {if (TODO['name'] === name) beautifulPrint(TODO)});
    console.log("-".repeat(100));
}

function sortImportance(){
    printTitle();
    TODOs
        .sort((a, b) => b.importance - a.importance)
        .forEach(TODO => {beautifulPrint(TODO)});
    console.log("-".repeat(100));
}

function sortUser(){
    printTitle();
    let usedNames = [];
    TODOs
        .forEach(TODO =>
        {
            if (!usedNames.includes(TODO.name) && TODO.name === 'NaN'){
                user(TODO.name);
                usedNames.push(TODO.name);
            }
        });
    TODOs
        .forEach(TODO =>
        {
            user(TODO.name);
        });
    console.log("-".repeat(100));
}


function sortDate(date){
    printTitle();
    TODOs
        .sort((a, b) => b.date - a.date)
        .forEach(TODO => {beautifulPrint(TODO)});
    console.log("-".repeat(100));
}

function findDate(date){
    printTitle();
    TODOs
        .sort((a, b) => b.date - a.date)
        .forEach(TODO => {
            if (TODO.date >= date)
                beautifulPrint(TODO)
        });
    console.log("-".repeat(100));
}

function truncateString(str, len) {
    return str.substring(0, len) + (len < str.length ? "…" : "");
}

function printTitle(){
    console.log(` ! |   name   |    date    | comment`);
    console.log("-".repeat(100));
}

function beautifulPrint(TODO){
    let importance = TODO.importance > 0 ? "! " : "  ";
    let name = TODO.name === 'NaN' ? "".padEnd(longestName)
        : " " + truncateString(TODO.name, 8).padEnd(longestName - 1)
    let date = TODO.date === 'NaN' ? "".padEnd(10)
        : `${TODO.date.getFullYear()}-${TODO.date.getMonth() + 1}-${TODO.date.getDate()}`.padEnd(10);
    let comment = truncateString(TODO.comment, 48);
    console.log(` ${importance}|${name}| ${date} | ${comment}`);

}

function processCommand(command) {
    if (command.includes('user') && !command.includes('sort')){
        user(command.split(" ")[1].toLowerCase());
    }
    else if (command.includes('date') && !command.includes('sort')){
        findDate(new Date(command.split(" ")[1]));
    }
    else
        switch (command) {
            case 'exit':
                process.exit(0);
                break;
            case 'sort importance':
                sortImportance();
                break;
            case 'sort user':
                sortUser();
                break;
            case 'sort date':
                sortDate();
                break;
            case 'important':
                important();
                break;
            case 'show':
                show();
                break;
            default:
                console.log('wrong command');
                break;
        }
}
// TODO dssadas

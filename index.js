const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');
const { inflate } = require('zlib');
const Path = require('node:path');
const { create } = require('domain');

class Todo {
    constructor(line, fileName) {
        let todo = getFormattedTODO(line);
        this.importance = count(todo[2], "!");
        this.nameUser = todo[0].trim();
        this.date = todo[1].trim();
        this.comment = todo[2].trim();
        this.fileName = fileName
    }
}

class File {
    constructor(path) {
        this.name = Path.basename(path);
        this.lines = readFile(path);
    }
}

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => new File(path));
}

const files = getFiles();
const TODOs = files.map((file) => file.lines.match(/\/\/ TODO .*/g)
                                .filter(line => getFormattedTODO(line) !== null)
                                .map(line => new Todo(line, file.name)))
                    .flat(Infinity);

console.log('Please, write your command!' );
readLine(processCommand);

const COMMANDS = { 
    "exit" : () => process.exit(0),
    "show" : () => TODOs.map( x => x),
    "important": () =>TODOs.filter(todo => todo.importance != 0),
    "user" : (name) => TODOs.filter(todo => todo.nameUser === name),
    "sort" : (nameFunc) => SORTS_COMMAND[nameFunc]?.(),
    "date": (date)=> { let d = Date.parse(date);
         return TODOs.filter(todo => Date.parse(todo.date) > d);} 
}

const SORTS_COMMAND ={
    "importance": () => COMMANDS["show"]().sort((a,b) => b.importance - a.importance),
    "user": () => COMMANDS["show"]().sort((a,b) => compareString(a.nameUser, b.nameUser)),
    "date": () => COMMANDS["show"]().sort((a,b) => Date.parse(b.date) - Date.parse(a.date))
}

function count(str,char){
	return str.match(new RegExp(char, "g"))?.length ?? 0;
}

function getFormattedTODO(todo){
    let a = todo.substr(8).trim().toLowerCase().split(';');
    return a.length != 3? null: a;
}

function compareString(first, second){
    if (first > second) return 1;
    else if (first < second) return -1;
    return 0;
}

function processCommand(command) {
    let c = command.split(' ').map(s => s.toLowerCase());

    if(!(c[0] in COMMANDS)){
        console.log('wrong command');
    }else{
        let args = [c.slice(1).join(' ')].filter(s => s.length !== 0);
        let iterableTODOs = COMMANDS[c[0]](...args);
        if (iterableTODOs === undefined || args.length !== COMMANDS[c[0]].length){
            console.log('wrong command')
        }else{
            printTable(iterableTODOs);
        }
    }
}

// в шарпе, я бы, наверное, класс сделал вместо одной фукнции
function printTable(iterableTODOs){
    let header = ['FILE NAME',"!", 'USER', 'DATE', 'COMMENT'];
    let maxWidths = [15, 1, 10, 10, 50];
    let properties = ["fileName", "importance", "nameUser", "date", "comment"]
    let widths = header.map(x => x.length);

    for( let todo of iterableTODOs){
        for (let i = 0; i < header.length; i++){
            widths[i] = Math.min(maxWidths[i], Math.max(widths[i], String(todo[properties[i]]).length));
        }
    }

    let head = createRow(header, widths, maxWidths);
    let separator = `+${'-'.repeat(head.length - 2)}+`;
    console.log(separator);
    console.log(head);
    console.log(separator);
    
    for (let todo of iterableTODOs){
        let row = [];
        for (let property of properties){
            if (property === "importance"){
                row.push(todo[property] !== 0? '!': ' ');
            }else  row.push(todo[property]);
        }
        console.log(createRow(row, widths, maxWidths));
    }

    console.log(separator);
}

function createRow(row, widths, maxWidths){
    let a = row.map((x, i) => x.length > maxWidths[i]? cutString(x,maxWidths[i]) : String(x).padEnd(widths[i]));
    return '|  ' + a.join('  |  ') + '  |';
}


function cutString(str, length){
    if (str.length > length){
        return str.substring(0, length - 3).padEnd(length,'.');
    }
    return str.padEnd(length);
}

// TODO a 
// TODO you can do it!
// TODO LOL; 1984-13-01; некорректная дата!
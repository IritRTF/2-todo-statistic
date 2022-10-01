const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');
const { inflate } = require('zlib');
const REG_DATE = /^date ([1-2][0-9]{3})$|([1-2][0-9]{3}-(0[1-9]|1[0-2]))$|([1-2][0-9]{3}-(0[1-9]|1[0-2]))-([0-2]\d|3[0-2])$/g
const Path = require('node:path');


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

const files = getFiles();
const TODOs = files.map((file) => file.lines.match(/\/\/ TODO .*/g)
                                .filter(line => getFormattedTODO(line) !== null)
                                .map(line => new Todo(line, file.name)))
                    .flat(Infinity);

const COMMANDS = { 
    "exit" : () => process.exit(0),
    "show" : () => TODOs.map( x => x),
    "important": () =>TODOs.filter(todo => todo.importance != 0),
    "user" : (name) => TODOs.filter(todo => todo.nameUser === name),
    "sort" : (nameFunc) => SORTS_COMMAND[nameFunc], 
}

const SORTS_COMMAND ={
    "importance": () => COMMANDS["show"]().sort((a,b) => b.importance - a.importance),
    "user": () => COMMANDS["show"]().sort((a,b) => compareString(a.nameUser, b.nameUser)),
    "date": () => COMMANDS["show"]().sort((a,b) => Date.parse(b.date) - Date.parse(a.date))
}


function getFormattedTODO(todo){
    let a = todo.substr(8).trim().toLowerCase().split(';');
    return a.length != 3? null: a;
}


function compareString(first, second){
    if (first > second){
        return 1;
    }
    else if (first < second){
        return -1;
    }
    return 0;
}

console.log('Please, write your command!' );
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => new File(path));
}

function processCommand(command) {
    if( command == "exit"){
        COMMANDS[command]();
    }else if (command == "show"){
        printTable(COMMANDS[command]());
    }else if (command == "important"){
        printTable(COMMANDS[command]());
    }else if (command.startsWith("user")){
        let name = command.match(/ .*/).flat(Infinity)[0].trim().toLowerCase();
        printTable(COMMANDS["user"](name));
    }else if (command.match(/^sort (importance|user|date)/g)){
        let a = command.split(" ");
        printTable(COMMANDS[a[0]](a[1])());
    }
    else if (command.match(REG_DATE)){
        let b = command.split(" ");
        let date = Date.parse(b[1]);

        printTable(TODOs.filter(todo => Date.parse(todo.date) > date));
    }
    else{
        console.log('wrong command');
    }
}

function count(str,char){
	return str.match(new RegExp(char, "g"))?.length ?? 0;
}

function printTable(iterableTODOs){
    let header = `|  ${'FILE NAME'.padEnd(15)}  |  !  |  ${'USER'.padEnd(10)}  |  ${'DATE'.padEnd(10)}  |  ${'COMMENT'.padEnd(50)}  |`
    let separator = `+${'-'.repeat(header.length - 2)}+`;
    console.log(separator);
    console.log(header);
    console.log(separator);
    for( let todo of iterableTODOs){
        console.log(`|  ${rezak(todo.fileName,15)}  |  ${todo.importance !== 0? '!': ' '}  |  ${rezak(todo.nameUser,10)}  |  ${rezak(todo.date,10)}  |  ${rezak(todo.comment,50)}  |`)
        console.log(separator);
    }
}

function rezak(str, length){
    if (str.length > length){
        return str.substring(0, length - 3).padEnd(length,'.');
    }
    return str.padEnd(length);
}

/*+-------------------------------------------------------------------------------------------+*/
/*| fileName.padEnd(30)  |  !  |  user.padEnd(10)  |  date.padEnd(10)  |  comment.padEnd(50)  |*/
/*+-------------------------------------------------------------------------------------------+*/
/*|  ${todo.fileName.padEnd(30)}  | ${'!'? todo.importance !== 0: ' '}  |  ${todo.nameUser.padEnd(10)}  |  ${todo.date.padEnd(10)}  |  ${todo.comment.padEnd(50)}  | */
/*+-------------------------------------------------------------------------------------------+*/

// TODO a 
// TODO you can do it!
// TODO LOL; 1984-13-01; некорректная дата
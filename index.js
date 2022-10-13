const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function processCommand(command) {
    switch (command) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            console.log(showTodo());
            break;
        case 'important':
            importantTodo()
            break;
        default:
            console.log("Def")
            break;
    }
}

function showTodo(){
    let temp = getFiles().map(str => str.split("\r\n"));
    temp = temp.flat(Infinity).filter(a => a.includes("// TODO") && !a.includes("temp ="));
    temp = temp.map(a => a.slice(a.indexOf("/")))
    return temp;
}

function importantTodo(){
    console.log(showTodo().filter(a => a.includes("!")));
}

// TODO you can do it!
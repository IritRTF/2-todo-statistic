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
    command = command.split(' ');
    switch (command[0]) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            console.log(showTodo());
            break;
        case 'important':
            console.log (importantTodo())
            break;
        case 'user':
            let user = command[1].charAt(0).toUpperCase()
            userTodo(user)
            break;
        case 'sort':
            switch (command[1]){
                case 'importance':
                    break;
                case 'name':
                    break;
                case 'date':
                    break;
            }
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
    return (showTodo().filter(a => a.includes("!")));
}

function userTodo(user){
    console.log(showTodo().filter(a => a.includes(user)))
}

function sortImportance(){

}

function  sortUserName(){
    
}

function sortData(){
    
}

// TODO you can do it!

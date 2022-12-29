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
    [command, arg] = command.split(" ");
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
        case 'user':
            console.log(filterByUser(arg));
            break;
        case 'sort':
            sortByArg(arg);
            break;
        case 'date':
            sortByDate(arg);
            break;
        default:
            console.log("Wrong command!");
            break;
    }
}

function showTodo(){
    let res = files.map(str => str.split("\r\n"));
    res = res.flat(Infinity).filter(a => a.includes("// TODO") && !a.includes("res ="));
    res = res.map(a => a.slice(a.indexOf("/") + 8));
    return res;
}

function splitedTodo(){
    return showTodo().map(str => str.split("; "));
}

function importantTodo(){
    console.log(showTodo().filter(a => a.includes("!")));
}

function filterByUser(user){
    return splitedTodo().filter(el => el[0].toLowerCase() === user.toLowerCase());
}

function sortByDate(arg){
    console.log(splitedTodo().filter(el => new Date(el[1]) > new Date(arg)).sort((a,b) => new Date(b[1]) - new Date(a[1])));
}


function sortByArg(arg){
    let arr = showTodo();
    let anonUsers = splitedTodo().filter(el => el.length === 1);
    let normalUsers = splitedTodo().filter(a => a.length === 3);
    switch (arg){
        case "importance":
            arr.sort((a,b) => b.split("!").length - a.split("!").length);
            console.log(arr);
            break;
        case "user":
            let usernames = [...new Set(normalUsers.map(str => str[0].toLowerCase()))];
            let result = usernames.map(a => filterByUser(a));
            result = result.concat(anonUsers);
            console.log(result);
            break;
        case "date":
            let res = normalUsers.sort((a,b) => new Date(b[1]) - new Date(a[1]));
            res = res.concat(anonUsers);
            console.log(res);
            break;
        default:
            console.log("Неправильный аргумент");
            break;
    }
}
// TODO you can do it!

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
    let commands = command.split(' ');
    switch (commands[0]) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            console.log(showTodo());
            break;
        case 'important':
            console.log (importantTodo());
            break;
        case 'user':
            let user = commands[1].charAt(0).toUpperCase();
            console.log(userTodo(user).flat(Infinity));
            break;
        case 'sort':
            let arg = commands[1];
            sortByArg(arg);
            break;
        case 'date':
            let date = commands[1];
            sortByDate(date);
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

function  splitedTodo(){
    return showTodo().map(str => str.split("; "));
}

function importantTodo(){
    return (showTodo().filter(a => a.includes("!")));
}

function userTodo(user){
    return showTodo().filter(a => a.includes(user))
}

function filterByUser(user){
    return splitedTodo().filter(el => el[0].toLowerCase() === user);
}

function sortByArg(arg){
    let arr = showTodo();
    let anonUsers = splitedTodo().filter(el => el.length === 1);
    let normalUsers = splitedTodo().filter(a => a.length === 3);
    switch (arg){
        case "importance":
            arr.sort((a,b) => b.split("!").length - a.split("!").length);
            console.log(arr.flat(Infinity));
            break;
        case "user":
            let usernames = [...new Set(normalUsers.map(str => str[0].toLowerCase()))];
            let result = usernames.map(a => filterByUser(a));
            result = result.concat(anonUsers);
            console.log(result.flat(Infinity));
            break;
        case "date":
            let res = normalUsers.sort((a,b) => new Date(b[1]) - new Date(a[1]));
            res = res.concat(anonUsers);
            console.log(res.flat(Infinity));
            break;
        default:
            console.log("Неверный аргумент");
            break;
    }
}

function sortByDate(arg){
    console.log(splitedTodo().filter(el => new Date(el[1]) > new Date(arg)).sort((a,b) => new Date(b[1]) - new Date(a[1])).flat(Infinity));
}

// TODO you can do it!

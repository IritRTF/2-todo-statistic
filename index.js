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
            showImportantTodo();
            break;

        case 'user':
            console.log(showUserTodo(arg));
            break;

        case 'sort':
            sortByArg(arg);
            break;

        default:
            console.log('wrong command');
            break;
    }
}

let arrayOfTodo = files.map((i) => i.match(/\/\/ TODO .*/g)).flat(Infinity);

function showTodo(){
    let result = arrayOfTodo.map(a => a.slice(a.indexOf("/") + 8));
    return result;
}

let showImportantTodo = () => { arrayOfTodo.filter((i) => i.includes('!')).forEach((el) => console.log (el)) }

let showUserTodo = (user) => { return splitTodo().filter(el => el[0].toLowerCase() === user.toLowerCase()) }

let splitTodo = () => { return showTodo().map(el => el.split("; ")); } 

function sortByArg(arg){
    let resOfTodo = showTodo();
    let unnamedUsers = splitTodo().filter(el => el.length === 1);
    let authorisedUsers = splitTodo().filter(el => el.length === 3);

    switch (arg){
        case "importance":
            resOfTodo.sort((a,b) => b.split("!").length - a.split("!").length);
            console.log(resOfTodo);
            break;

        case "user":
            let usernames = [...new Set(authorisedUsers.map(str => str[0].toLowerCase()))];
            let result = usernames.map(a => showUserTodo(a));
            result = result.concat(unnamedUsers);
            console.log(result);
            break;

        case "date":
            let res = authorisedUsers.sort((a,b) => new Date(b[1]) - new Date(a[1]));
            res = res.concat(unnamedUsers);
            console.log(res);
            break;

        default:
            console.log("wrong command");
            break;
    }
}

// TODO you can do it!

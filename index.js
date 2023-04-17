const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');
const globalExpr = '//' + ' TODO' //Для того чтобы в поиск не попадало
const exp = require('constants');

const files = getFiles();

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function showTodo(arr){
    for (let i = 0; i < arr.length; i++){
        console.log(arr[i])
    }
}

function findTODO(arr = [], contains = '', expr = [globalExpr]) {
    let elements = []
    for (let i = 0; i < arr.length; i++) {
        for (let exprNumb = 0; exprNumb < expr.length; exprNumb++) {
            let cursorIndex = arr[i].indexOf(expr[exprNumb]);
            while (cursorIndex > 0) {
                const endStringIndex = files[i].indexOf('\n', cursorIndex)
                const substring = files[i].substring(cursorIndex, endStringIndex)
                if (contains.length > 0) {
                    if (substring.includes(contains)) {
                        elements.push(substring)
                    }
                } else {
                    elements.push(substring)
                }

                cursorIndex = arr[i].indexOf(expr, endStringIndex);
            }
        }
    }
    return elements;
}

function commandParse(command) {
    const firstSpaceIndex = command.indexOf(' ');
    const params = command.substring(firstSpaceIndex,).split(';')
    return {
        'command': firstSpaceIndex < 0 ? command : command.substring(0, firstSpaceIndex),
        'user': params[0] ? params[0].trim() : '',
        'date': params[1] ? params[1].trim() : '',
        'comment': params[2] ? params[2].trim() : ''
    }
}

function processCommand(str) {

    let parse = commandParse(str)
    const command = parse.command
    const date = parse.date
    const user = parse.user
    const comment = parse.comment

    switch (command) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            showTodo(findTODO(files));
            break;
        case 'important':
            showTodo(findTODO(files, contains = '!'));
            break;
        case 'user':
            const expressions = [
                `${globalExpr} ${user.toUpperCase()}`,
                `${globalExpr} ${user[0].toUpperCase()}${user.slice(1).toLowerCase()}`,
                `${globalExpr} ${user.toLowerCase()}`]
            showTodo(findTODO(files, contains = '', expr = expressions));
            break;
        default:
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!

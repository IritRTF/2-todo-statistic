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
    const splitedCommand = command.split(' ')
    return {
        'command': splitedCommand.length > 1 ? splitedCommand[0] : String(splitedCommand),
        'param': splitedCommand.length > 1 ? splitedCommand[1].trim() : ''
    }
}


// function commandParse(command) {
//     const firstSpaceIndex = command.indexOf(' ');
//     const params = command.substring(firstSpaceIndex,).split(';')
//     return {
//         'command': firstSpaceIndex < 0 ? command : command.substring(0, firstSpaceIndex),
//         'param': params[0] ? params[0].trim() : '',
//         'param1': params[1] ? params[1].trim() : '',
//         'param2': params[2] ? params[2].trim() : ''
//     }
// }

function commentToObject(comment){
    let obj = comment.slice(7,).split(';')
    return {'user': obj[0],
            'date': obj[1],
            'comment': obj[2]}
}

function sortBy(array, sortBy){
    let sortedArray = []
    switch (sortBy){
        case 'important':
            break;
        case 'date':
            break;
        case 'user':
            break;
        
    }
    return sortedArray;
}

function processCommand(str) {

    let parse = commandParse(str)
    const command = parse.command
    const param = parse.param

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
                `${globalExpr} ${param.toUpperCase()}`,
                `${globalExpr} ${param[0].toUpperCase()}${param.slice(1).toLowerCase()}`,
                `${globalExpr} ${param.toLowerCase()}`]
            showTodo(findTODO(files, contains = '', expr = expressions));
            break;
        case 'sort':
            showTodo(sortBy(findTODO(), param))
            break;
        default:
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!

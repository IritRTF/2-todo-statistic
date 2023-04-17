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

function showTodo(arr) {
    for (let i = 0; i < arr.length; i++) {
        console.log(arr[i])
    }
}

function getTODOs(arr = [], contains = '', expr = [globalExpr]) {
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

function sortByImportant(array) {
    let importantPriority = {}
    let maxCount = 0;
    for (let i = 0; i < array.length; i++) {
        let counter = 0
        for (let symbolIndex = 0; symbolIndex < array[i].length; symbolIndex++) {
            if (array[i][symbolIndex] == '!') {
                counter++
            }
            if (maxCount < counter) {
                maxCount = counter
            }
        }
        if (counter in importantPriority) {
            importantPriority[counter].push(array[i])
        } else {
            importantPriority[counter] = [array[i]]
        }
    }

    var result = []
    for (let i = maxCount; i >= 0; i--) {
        if (i in importantPriority) {
            importantPriority[i].forEach(element => {
                result.push(element)                
            });
        } else {
            continue
        }
    }
    return result

}

function sortBy(array, sortBy) {
    let sortedArray;
    switch (sortBy) {
        case 'important':
            return(sortByImportant(array))
        case 'date':
            break;
        case 'user':
            break;
    }
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
            showTodo(getTODOs(files));
            break;
        case 'important':
            showTodo(getTODOs(files, contains = '!'));
            break;
        case 'user':
            const expressions = [
                `${globalExpr} ${param.toUpperCase()}`,
                `${globalExpr} ${param[0].toUpperCase()}${param.slice(1).toLowerCase()}`,
                `${globalExpr} ${param.toLowerCase()}`]
            showTodo(getTODOs(files, contains = '', expr = expressions));
            break;
        case 'sort':
            showTodo(sortBy(getTODOs(files), param))
            break;
        default:
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!

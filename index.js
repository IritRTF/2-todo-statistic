const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');
const exp = require('constants');

const files = getFiles();

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function findTODO(arr = [], contains = '', expr = ['TODO']) {
    for (let i = 0; i < arr.length; i++) {
        for (let exprNumb = 0; exprNumb < expr.length; exprNumb++) {
            let cursorIndex = arr[i].indexOf(expr[exprNumb]);
            while (cursorIndex > 0) {
                const endStringIndex = files[i].indexOf('\n', cursorIndex)
                const substring = files[i].substring(cursorIndex, endStringIndex)
                if (contains.length > 0) {
                    if (substring.includes(contains)) {
                        console.log(substring)
                    }
                } else {
                    console.log(substring)
                }

                cursorIndex = arr[i].indexOf(expr, endStringIndex);
            }
        }
    }
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
            findTODO(files);
            break;
        case 'important':
            findTODO(files, contains = '!');
            break;
        case 'user':
            const expressions = [
                `TODO ${user.toUpperCase()}`,
                `TODO ${user[0].toUpperCase()}${user.slice(1).toLowerCase()}`,
                `TODO ${user.toLowerCase()}`]
            findTODO(files, contains = '', expr = expressions);
            break;
        default:
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!

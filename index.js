const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function findTODO(arr = [], contains = '', expr = '// TODO') {
    for (let i = 0; i < arr.length; i++) {
        let cursorIndex = arr[i].indexOf(expr);
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

function processCommand(command) {
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
        default:
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!

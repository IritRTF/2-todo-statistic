const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function findTODO(arr = [], expr = '// TODO'){
    for (let i=0; i<arr.length; i++){
        let cursorIndex = arr[i].indexOf(expr);
        while (cursorIndex>0){
            let endStringIndex = files[i].indexOf('\n', cursorIndex)
            if (endStringIndex<0){
                console.log(files[i].substring(cursorIndex));
                continue;
            }
            console.log(files[i].substring(cursorIndex, endStringIndex))    
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
        default:
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!

const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function show(file) {
    return file.split('\n')
        .filter(x => x.indexOf('// TOD' + 'O') !== -1)
        .map(x => x.split('// TOD' + 'O')[1]);
}

function important(file) {
    return show(file).filter(x => x.indexOf('!') !== -1);
}

function user(file, name) {
    return show(file).filter(x =>
        x.split(';')[0].toLowerCase().trim() === name.toLowerCase());
}

function findComments(func) {
    getFiles()
        .forEach(x => func(x)
            .forEach(y => console.log(y)));
}

function findComments2(func, name) {
    getFiles()
        .forEach(x => func(x, name)
            .forEach(y => console.log(y)));
}

function count(str) {
    return str.split("!").length - 1
}

function sortComments(type) {
    switch (type) {
        case 'importance':
            return getFiles().flatMap(x => show(x))
                .sort((a, b) => count(a) < count(b) ? 1 : -1)
                .forEach(y => console.log(y));
            break;
        case 'user':
            break;
        case 'date':
            break;
        default:
            console.log('wrong command');
            break;
    }

}


function processCommand(command) {
    if (command.split(' ')[0] === 'user') {
        const userName = command.slice(command.indexOf(' ') + 1);
        findComments2(user, userName);
        process.exit(0);
    }
    switch (command) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            findComments(show);
            break;
        case 'important':
            findComments(important);
            break;
        case 'sort':
            sortComments('importance');
            break
        default:
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!
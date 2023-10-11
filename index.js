const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();
const arrTODO = files.map((i) => i.match(/\/\/ TODO .*/g)).flat(Infinity);
console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function processCommand(command) {
    let commandItSelf = command.split(' ');
    switch (commandItSelf[0]) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            arrTODO.forEach((i) => {console.log(i)});
            break;
        case 'important':
            arrTODO.filter((i) => i.includes('!')).forEach((j) => console.log(j));
            break;
        case 'user':
            arrTODO.filter((i) => splitedTODO(i)[0].toLowerCase() == commandItSelf[1].toLowerCase()).forEach((j) => console.log(j));
            break;
        case 'sort':
            sortBy(commandItSelf[1])
            break;
        default:
            console.log('wrong command');
            break;
    }
}

function splitedTODO(TODO){
    return TODO.replace(/\/\/ TODO /g, '').replace(' ', '').map(str => str.split("; "));
}

function sortBy(myau){
    let without = splitedTODO(arrTODO).filter(i => i.length == 1 );
    let userss = splitedTODO(arrTODO).filter(i => i.length == 3 )
    switch(myau) {
        case 'importance':
            arrTODO.sort((a,b) => b.split("!").length - a.split("!").length);
            console.log(arrTODO);
            break;
        case "user":
            let users = [...new Set(userss.map(j => j[0].toLowerCase()))];
            let sorted = users.map(i => filterByUser(i));
            sorted = sorted.concat(without);
            console.log(sorted);
            break;
        case 'date':
            console.log(userss.sort((a,b) => new Date(b[1]) - new Date(a[1])).concat(without));
            break;
    }
}
// TODO you can do it!

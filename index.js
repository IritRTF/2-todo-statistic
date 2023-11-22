const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');
const { info } = require('console');

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}


const files = getFiles();
let temporaryArray;

console.log('Please, write your command!');
readLine(processCommand);



function getTodo(){
    let lines = files.join('\r\n');
    let splitLines = lines.split('\n');
    let allTodoes = splitLines.map(item => {
        let index = item.indexOf('// TODO') + 7;
        if (item.includes('// TODO') && item[index] != '\''){
            return item.slice(item.indexOf('// TODO'), item.indexOf('/r'),);
        }
        else{
            return null
        };
    }).filter(item => item !== null);
    return allTodoes; 
}

function getImportant(){
    return getTodo().filter(item => item.includes('!'));
}

function getUser(argument){
    argument = argument || '';
    temporaryArray = getTodo();
    temporaryArray = temporaryArray.map(element => element.split('; '));
    
    temporaryArray.forEach((element, index) => {
        let splitedElement = element[0].split(' ');
        temporaryArray[index][0] = splitedElement[0] + ' '+ splitedElement[1];
        temporaryArray[index][1] = splitedElement[2];
    });
    return temporaryArray.filter(element => element[1].toLowerCase() === argument.toLowerCase());
}

function processCommand(command) {
    [command, argument] = command.split(" ");
    switch (command) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            console.log(getTodo());
            break;
        case 'user':
            let result = getUser(argument);
            result.forEach((element, index) => result[index] = element.join(' '));
            console.log(result.length == 0 ? 'user not found': result);
            break;
        case 'important':
            console.log(getImportant());
            break;
        case 'sort':
            if (argument == 'importance'){
                temporaryArray = getImportant();
                temporaryArray.forEach((element, index) => {
                    temporaryArray[index] = element.split('');
                });
                temporaryArray.sort((a, b) => b.filter(char => char === '!').length - a.filter(char => char === '!').length);
                temporaryArray.forEach((element, index) => {
                    temporaryArray[index] = element.join('');
                });
                console.log(temporaryArray);
            }
            else if(argument == 'user'){
                temporaryArray = getTodo();
                let sortedUsers = temporaryArray.map(element => element.split('; '))
                    .sort((a, b) => a[0].localeCompare(b[0]))
                    .map(element => element.join('; '));
                console.log(sortedUsers);
            }
            else if(argument == 'date'){
                temporaryArray = getTodo();
                let sortedDate = temporaryArray
                    .map(element => element.split('; '))
                    .map(element => {
                        element[1] = Date.parse(element[1]);
                        return element;
                    })
                    .sort((a, b) => a[1] - b[1])
                    .map(element => {
                        let date = new Date(element[1]);
                        element[1] = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
                        return element;
                    });
                sortedDate.forEach((element, index) => {
                    sortedDate[index] = element.map(item => item == 'NaN-NaN-NaN'? '': item)
                });
                sortedDate = sortedDate.map(element => element.join('; '));
                console.log(sortedDate);
            }
            else{
                console.log('wrong command');
            }
            break;
        default:
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!


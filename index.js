const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const path = require('node:path');
const files = getFiles();

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js'); 
    return filePaths.map(path => (readFile(path).match(/\/\/ TODO .*/g)).map(str => ({name: path.split('/').slice(-1)[0], text: str}))).flat(Infinity);
}

let ans = []
console.log(files)
for (let i = 0; i < files.length; i++) {
        let comment = files[i].text
            .slice(8, )
            .split(";")
            .map(item => item.trim())

        isOnlyText = comment.length !== 3
        
        ans.push({
            importance: getListIdx(comment.slice(-1)[0], '!').length, 
            user: isOnlyText ? undefined : comment[0].toLowerCase(), 
            date: isOnlyText ? undefined : comment[1], 
            text: isOnlyText ? comment[0] : comment[2], 
            fileName: files[i].name,
        })
}

function processCommand(command) {
    switch (command) {
        case 'exit':
            process.exit(0);
            break;
        case 'show': 
            console.table(ans);
            break;
        case 'important': 
            console.table(ans.filter(item => item.importance > 0));
            break;
        case command.slice(0, 4) == 'user' ? command : true:
            let userName = command.slice(5, command.length).toLowerCase()
            console.table(ans.filter(item => item.user === userName));
            break;
        case command.slice(0, 4) == 'sort' ? command : true:
            let sortName = command.slice(5, command.length)
            let sorteAns = ans
                .filter(item => item[sortName] !== undefined)
                .sort(sortFunc[sortName])
                .concat(ans.filter(item => item[sortName] === undefined))
            console.table(sorteAns);
            break;
        case command.slice(0, 4) == 'date' ? command : true:
            let date = command.slice(5, command.length)
            let sorteDateAns = ans
                .filter(item => item.date !== undefined && item.date > date)
                .sort(sortFunc['date'])
            console.table(sorteDateAns);
            break;
        default:
            console.log('wrong command');
            break;
    }
}

function getListIdx(str, substr) {
    let listIdx = []
    let lastIndex = -1
    while ((lastIndex = str.indexOf(substr, lastIndex + 1)) !== -1) {
      listIdx.push(lastIndex)
    }
    return listIdx
  }

const sortFunc = {
    importance: (a, b) => b.importance - a.importance,
    user: (a, b) => a.user > b.user ? 1 : -1,
    date: (a, b) => a.date < b.date ? 1 : -1,
};

// TODO you can do it!

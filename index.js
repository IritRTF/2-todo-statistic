const { getAllFilePathsWithExtension, readFile } = require('./fileSystem');
const { readLine } = require('./console');

const files = getFiles();

const todoList = getTodoList(files);

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}


function getTodoList(files) {
    let regExp = new RegExp('\/\/ TODO .*', 'g')
    return files.map((file) => file.match(regExp)).flat(Infinity);
}

function processCommand(command) {
    let commands = command.split(' ');
    switch (commands[0]) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            console.log(todoList);
            break;
        case 'important':
            console.log(getImportantTodo(todoList));
            break;
        case 'name':
            console.log(getNamedTodo(todoList, commands[1]));
            break;
        case 'sort':
            switch (commands[1]){
                case 'importance':
                    console.log(sortImportance(getImportantTodo(todoList), commands[1]));
                    break;
            }
            break;
        default:
            console.log('wrong command');
            break;
    }
}

function getImportantTodo(todoList) {
    let importantTodo = [];

    todoList.forEach(element => {
        if (~element.indexOf("!")) {
            importantTodo.push(element);
        }
    });

    return importantTodo;
}

function getNamedTodo(todoList, userName) {
    let namedTodo = {};
    userNameLower = userName.toLowerCase();

    todoList.forEach(element => {
        if (~element.indexOf(";")) {
            let name = element.slice(element.indexOf('TODO') + 5, element.indexOf(';'))
            namedTodo[name] = element.slice(element.indexOf(';', element.indexOf(';') + 1) + 1,);
        }
    });
    let answerArray = []
    for (let key in namedTodo) {
        if (key.toLowerCase() == userNameLower) {
            answerArray.push(namedTodo[key])
        }
    }
    return userName + answerArray
}

function countExclamationMarks(str) {
    let count = 0;
    for (let i = 0; i < str.length; i++) {
      if (str[i] === "!") {
        count++;
      }
    }
    return count;
  }
  
  function sortImportance(importantTodo) {
    let sortImportanceObject = {}
    for (let i = 0; i < importantTodo.length ; i++) {
        sortImportanceObject[countExclamationMarks(importantTodo[i])] = importantTodo[i];
    }
    let sortedImportance = Object.keys(sortImportanceObject)
    .sort()
    .reverse()
    .reduce((acc, key) => ({
        ...acc, [key]: sortImportanceObject[key]
    }), {})
    console.log(sortedImportance);
  }
// TODO you can do it!

const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();
const todoList = getTodoList(files);
const importantTodoList = getImportantTodo(todoList);

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function getTodoList(files){
    let regExp = new RegExp('\/\/ TODO .*', 'g')
    return files.map((file) => file.match(regExp)).flat(Infinity);
}

function getImportantTodo(todoList){
    let importantTodo = [];
    todoList.forEach(element => {
        if (element.includes('!')){
            importantTodo.push(element);
        }
    });
    return importantTodo;
}

function getCommertAuthor(authorName, todoList){
    let authorComments = [];
    let key = (authorName + ';').toLowerCase();
    todoList.forEach(element => {
        if (element.toLowerCase().includes(key)){
            authorComments.push(element);
        }
    });
    return authorComments;
}

function compareStr(firstStr, secondStr) {
    if (firstStr < secondStr){
        return -1;
    } 
    if (firstStr > secondStr){
        return 1;
    } 
    return 0;
}

function getDateComments(comment){
     let dataComment = comment.split(';');
     if (dataComment.length === 3){
        return new Date(dataComment[1].trim().toString());
     }
}

function getAuthorName(comment){
    let indexFirstSymbolName = 8;
    let authorName = [];
    for (let i = indexFirstSymbolName; i < comment.length; i++){
        if (comment[i] === ';'){
            return authorName.toString();
        }
        else{
            authorName.push(comment[i]);
        }
    }
}

function getAfterSpecifiedDateComments(date, todoList){
    let specifiedDate = new Date(date);
    let comments = [];
    for (let i = 0; i < todoList.length; i++){
        if(getDateComments(todoList[i]) > specifiedDate){
            comments.push(todoList[i]);
        }
    }
    return comments;
}

function countExclamationMark(str){
    return str.match(/'!'/g)?.length;
}

function getSortImportantComments(importantTodoList){
    return importantTodoList.sort((a, b) => countExclamationMark(b) - countExclamationMark(a));
}

function getSortUserComments(todoList){
    return todoList.sort((a, b) => compareStr(getAuthorName(a.toLowerCase()), getAuthorName(b.toLowerCase())));
}

function getSortDateComments(todoList){
    return todoList.sort((a, b) => getDateComments(b) - getDateComments(a)); 
}

function checkUserInCommand(command){
    if(command.includes('user')){
        let userName = command.split(' ')[1];
        console.log(getCommertAuthor(userName, todoList));
    }
}

function checkParameterSortInCommand(command){
    if(command.includes('sort')){
        let parameter = command.split(' ')[1];
        if(parameter === 'importance'){
            console.log(getSortImportantComments(importantTodoList));
        }
        if(parameter === 'user'){
            console.log(getSortUserComments(todoList));
        }
        if(parameter === 'date'){
            console.log(getSortDateComments(todoList));
        }
    }
}

function checkDateCommand(command){
    if(command.includes('date')){
        let date = command.split(' ')[1];
        console.log(getAfterSpecifiedDateComments(date, todoList));
    }
}


function useEasyCommand(command){
    switch (command) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            console.log(todoList);
            break;
        case 'important':
            console.log(importantTodoList);
            break;
        default:
            console.log('wrong command');
            break;
    }
}

function processCommand(command) {
    checkUserInCommand(command);
    checkParameterSortInCommand(command);
    checkDateCommand(command);
    useEasyCommand(command);
}

// TODO you can do it!

const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');


const files = getFiles();

let todoList = [];
let importantList = [];
let col = new Comment(" comment","name","date",1)
let commentsList = [];
let userList = [];
let unknownComments =[]; 
let columnsDone = false;

function Comment( comment , autor = "none" , date = "none", weight = 0 ){
    this.autor = autor;
    this.date = date ;  
    this.comment = comment; 
    this.weight = weight;  
}


console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function processCommand(command) {
    let mainCommand = command.split(' ');
    console.log();
    findComments();
    parseComments();
    switch (mainCommand[0]) {
        case 'exit':
            process.exit(0);
        case 'user':
            showUserComments(mainCommand[1].toLowerCase())//работает в любом регистре
            break;
        case 'show':            
            showAllComments();
            break;
        case 'important':
            showImportant();             
            break;
        case 'sort':
            getSortedList(mainCommand[1]);        
            break;
        case 'date':
            showCommentsAfterDate(mainCommand[1]);        
            break;
        default:
            console.log("wrong command!");
            break;
    }
}

function showCommentsAfterDate(input){
    let date = (new Date(input)).getTime();
    console.log(`Comments after ${input}: `)
    for (let com of commentsList){
        if ((new Date(com.date)).getTime() >= date)
            printComment(com);
    }
}
function showImportant(){
    for (let i of importantList) 
        printComment(i);  

}

function showSortedUsersComments(){
    for (let user of userList)
        showUserComments(user);
        console.log('unknown comments:')
        for (let com of unknownComments)
            printComment(com);
}

function showCommentsOnDate(){
    let sortedList = commentsList.sort((a,b) => (new Date(b.date)).getTime() - (new Date(a.date)).getTime());
    for (let com of sortedList){
        printComment(com);
    }
    for (let com of unknownComments)
            printComment(com);
}

function getSortedList(key){
    switch(key){
        case 'importance':
            showImportant();
            break;
        case 'user':
            showSortedUsersComments();
            break;
        case 'date':
            showCommentsOnDate();
            break;
        default:
            console.log('wrong key!');
            break;
    }

}

function showUserComments(user){
    if (! ~userList.indexOf(user))
        console.log(`wrong user name : ${user}`);
    else {
        console.log(`${user.toUpperCase()} comments:`);
        for (let com of commentsList){
            if (com.autor == user)
                printComment(com);
        }
    }
}

function printComment(comment){
    if(!columnsDone){
        columnsDone = true;
        printComment(col);
        console.log('-'.repeat(121));
    }
        
    let name = ''.padEnd(10);
    if (comment.autor !== null){
        name = comment.autor.length > 10 ?  comment.autor.slice(0,7) + '...' : comment.autor + ''.padEnd(10 - comment.autor.length)
    }
    let com = comment.comment.length > 50 ? comment.comment.slice(0,78) + '...' : comment.comment

    console.log(` ${comment.weight == 0 ? ' ' : '!'}` + ' | ' +
    `${name}` + ' | ' +
    `${comment.date==null ? ''.padEnd(10) : comment.date + ''.padEnd(10 - comment.date.length)}` + ' | ' +
    com )

}

function parseComments(){
    for (let com of todoList){
        let pos = 0
        let weight = (com.match(/!/g) || []).length;
        if (~com.indexOf(";")){
            pos = com.indexOf(';');
            let autor = com.slice(0,pos).trim().toLowerCase();
            let posDate = com.indexOf(';',pos+1);
            let date = com.slice(pos+1,posDate).trim();
            let comment = com.slice(posDate+1,)           
            commentsList.push(new Comment(comment,autor,date,weight));
            if (! ~userList.indexOf(autor))
                userList.push(autor);
        }
        else unknownComments.push(new Comment(com,null,null,weight))
    }
    findImportant();
}

function findImportant(){
    for (let com of commentsList){
        if (com.weight > 0) importantList.push(com);
    }
    for (let com of unknownComments){
        if (com.weight > 0) importantList.push(com);
    }
    importantList.sort((a,b) => b.weight-a.weight);
}

function showAllComments(){
    for (let com of commentsList)
        printComment(com);
    for (let com of unknownComments)
        printComment(com);
}

function findComments(){
    let trg = 'todo'.toUpperCase();// чтобы не считывал todo как комментарий
    let startTarget = '// '+ trg;
    let endTarget = '\r\n'

    for (let str of files){
        let pos = 0;
        while (true){
            let startPos = str.indexOf(startTarget, pos);
            if (startPos == -1) break;
            let endPos = str.indexOf(endTarget,startPos);
            todoList.push(str.slice(startPos + 8,endPos))
            pos = endPos + 1;
        }
    }
}
// TODO you can do it!



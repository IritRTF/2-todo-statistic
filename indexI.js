const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();
let TODOs = [];
let impTODOs = [];

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function findTODO(file){
    let TODOs = [];
    file.forEach(line => {
        if(line.includes("// TODO ") && !line.includes('"// TODO "'))
            TODOs.push(line.split("// TODO ")[1]);
    });
    return TODOs;
}

function findImpTODO(file){
    let impTODOs = [];
    file.forEach(line => {
        if(line.includes("// TODO ") && line.includes("!") && !line.includes('"// TODO "'))
        impTODOs.push(line.split("// TODO ")[1]);
    });
    return impTODOs;
}

function fileSeparation(list, func){
    files.forEach(file => {
        list.push(func((file.split("\r\n"))));
    });
}

function fileConcat(list){
    let result = []; 
    for(let i = 0; i < list.length; i++)
        result = result.concat(list[i]);
    return result;
}

function show(){
    fileSeparation(TODOs, findTODO);
    beautifulPrint(fileConcat(TODOs))
}

function important(){
    fileSeparation(impTODOs, findImpTODO);
    beautifulPrint(fileConcat(impTODOs));
}

function classification(list){ //Разделение всего листа на user/date/com
    list.forEach(el => {
        if(el.includes(';')) {
            splitEl = el.split(';');
            el = {
                user: splitEl[0],
                date: splitEl[1],
                comment: splitEl[2]
            };
        }
        else{
            el = {
                user: -1,
                date: -1,
                comment: el
            };
        }
    })
}

function userSort(user, list){ //Разделение всего листа на user/date/com
    let result = [];
    list.forEach(el => {
        if(el.includes(';')) {
            splitEl = el.split(';');
            if(splitEl[0] == user){
                obj = {
                    user: splitEl[0].toLowerCase(),
                    date: splitEl[1],
                    comment: splitEl[2][0] === " " ? splitEl[2].substring(1, splitEl[2].length) : splitEl[2]
                };
                result.push(obj.comment); 
            }
        }
    })
    return result;
}

function findUserTODO(user){
    fileSeparation(TODOs, findTODO);
    let result = userSort(user, fileConcat(TODOs));
    //classification(TODOs);
    beautifulPrint(result);
}

function beautifulPrint(comments){
    console.log("-".repeat(100));
    comments.forEach(el => console.log(el))
    console.log("-".repeat(100));
}

function processCommand(command) {
    switch (command) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            show();
            break;
        case 'important':
            important();
            break;
        case 'sort importance':
            //sortImportance(); //last 
            break;
        case command.split(' ')[0] == 'user' && command.split(' ').length > 1 ? command : true:
            let user = command.split(' ')[1].toLowerCase();
            findUserTODO(user);
            break;
        case 'sort date':
            sortDate();
            break;
        default:
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!

const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function processCommand(command) {
    let newCommand = command.split(' '); // получаем массив с командой и аргументом
    switch (newCommand[0]) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            show();
            break;
        case 'important':
            showImportant();
            break;
        case 'user':
            console.log(showUser(newCommand[1]));
            break;
        case 'sort':
            sortBy(newCommand[1]);
            break;
        default:
            console.log('wrong command');
            break;
    }
}

const array = files.map((i) => i.match(/\/\/ TODO .*/g)).flat(Infinity); // парсим массив комментариев todo из files
function show(){ // выводим все комментарии из массива в консоль
    let result = array;
    result.forEach(element => {
        console.log(element)
    })
}
function showImportant(){ // выводим все комментарии содержащие ! из массива в консоль
    let res = array;
    res.filter(element => element.includes('!'))
          .forEach((i) => console.log(i));
}

let splitArray = () => { // извлекает имя, дату, комментарий и возвращает массив из этих строк
    return array.map(a => a.slice(a.indexOf("/") + 8)).map(el => el.split("; ")); 
} 

let showUser = (user) => { // сравниваем имя из комментария в нижнем регистре с именем из аргумента в нижнем регистре
    return splitArray().filter(i => i[0].toLowerCase() === user.toLowerCase()) 
}

function sortBy(argument){
    let UsersWithoutName = splitArray(array).filter(i => i.length == 1 );
    let UsersWithName = splitArray(array).filter(i => i.length == 3 )
    switch(argument) {
        case 'importance':
            array.sort((a,b) => b.split("!").length - a.split("!").length);
            console.log(array);
            break;

        case 'user':
            let usernames = [...new Set(UsersWithName.map(str => str[0].toLowerCase()))];
            let result = usernames.map(a => showUser(a));
            result = result.concat(UsersWithoutName);
            console.log(result);
            break;
        
        case 'date':
            console.log(UsersWithName.sort((a,b) => new Date(b[1]) - new Date(a[1])).concat(UsersWithoutName));
            break;
    }
}
// TODO you can do it!

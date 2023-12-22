// Подключаем необходимые модули
const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
// Подключаем модуль для чтения ввода пользователя
const {readLine} = require('./console');

const files = getFiles();
console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    // Получаем пути ко всем файлам с расширением '.js'
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    // Читаем содержимое каждого файла
    return filePaths.map(path => readFile(path));
}

function processCommand(command) {
    // Разбиваем введенную команду на команду и аргумент
    [command, arg] = command.split(" ");
    switch (command) {
        case 'exit':
            process.exit(0);
            break;

        case 'user':
            console.log(showUserTodo(arg));
            break;
    
        case 'sort':
            sortByArg(arg);
            break;

        case 'show':            
            console.log(showTodo());
            break;

        case 'important':
            showImportantTodo();
            break;

        default:
            console.log('wrong command');
            // Выводим сообщение о некорректной команде
            break;
    }
}

// Извлекаем все строки с задачами из файлов
let ar = files.map((i) => i.match(/\/\/ TODO .*/g)).flat(Infinity);

function showTodo(){
    // Формируем массив строк задач
    let sum = ar.map(a => a.slice(a.indexOf("/") + 8));
    return sum;
}

// Выводим важные задачи
let showImportantTodo = () => { ar.filter((i) => i.includes('!')).forEach((el) => console.log (el)) }
let splitTodo = () => { return showTodo().map(el => el.split("; ")); }
let showUserTodo = (user) => { return splitTodo().filter(el => el[0].toLowerCase() === user.toLowerCase()) } 

function sortByArg(arg){
    let mean1 = splitTodo().filter(el => el.length === 3);
    let rmean = showTodo();
    let nik = splitTodo().filter(el => el.length === 1);

    switch (arg){
        case "importance":
            rmean.sort((a,b) => b.split("!").length - a.split("!").length);
            console.log(rmean);
            break;

        case "date":
            let res = mean1.sort((a,b) => new Date(b[1]) - new Date(a[1]));
            res = res.concat(nik);
            console.log(res);
            break;

        case "user":
            let names = [...new Set(mean1.map(str => str[0].toLowerCase()))];
            let summa = names.map(a => showUserTodo(a));
            summa = summa.concat(nik);
            console.log(summa);
            break;

        default:
            console.log("wrong command");
            break;
    }
}

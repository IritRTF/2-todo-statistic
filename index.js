const { getAllFilePathsWithExtension, readFile } = require('./fileSystem');
const { readLine } = require('./console');

const files = getFiles();
const TODOs = files.map((file) => file.match(/\/\/ TODO .*/g)).flat(Infinity);

console.log('Please, write your command!');

readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map((path) => readFile(path));
}

function getCommentsByAuthor(author) {
    /**
     * Возвращает массив комментариев определённого автора.
     * @param {String} author Имя автора.
     */
    return TODOs.map((comment) =>
        comment
            .replace(/\/\/ TODO /g, '')
            .replace(' ', '')
            .split(';')
    )
        .filter(
            (commentList) =>
                commentList[0].toLowerCase() === author.toLowerCase()
        )
        .map((array) => array.pop())
        .map((comment) => comment.trim());
}

function checkName(todo) {
    let form = todo.substr(0).trim().split(';');
    return form.length != 3 ? Infinity : form[0];
}

function countChar(char, str) {
    let a = new RegExp(char, 'g');
    let result = str.match(a)?.length;
    return result ?? 0;
}

function compareStrings(a, b) {
    if (a > b) return 1;
    else if (a < b) return -1;
    return 0;
}

function checkDate(todo) {
    let form = todo.substr(0).trim().split(';');
    return form.length != 3 ? 0 : form[1];
}
// TODO digi; 2018-13-21 ; ALO
function getDate(date) {
    if (isNaN(Date.parse(date))) return 0;
    return Date.parse(date);
}

function sortBy(key) {
    if (key === 'importrance')
        return TODOs.sort((a, b) => countChar('!', b) - countChar('!', a));
    if (key === 'user')
        return TODOs.sort((a, b) =>
            compareStrings(
                checkName(a.toLowerCase()),
                checkName(b.toLowerCase())
            )
        );
    if (key === 'date')
        return TODOs.sort(
            (a, b) => getDate(checkDate(b)) - getDate(checkDate(a))
        );
}

function processCommand(command) {
    if (command === 'exit') process.exit();
    else if (command === 'show')
        TODOs.forEach((comment) => {
            console.log(comment);
        });
    else if (command === 'important')
        TODOs.filter((item) => item.includes('!')).forEach((x) =>
            console.log(x)
        );
    else if (command.match(/^user [^ ,\n]*/g))
        getCommentsByAuthor(command.split(' ')[1]).forEach((comment) =>
            console.log(comment)
        );
    else if (command.match(/^sort (importrance|user|date)/g)) {
        sortBy(command.split(' ')[1]).forEach((item) => console.log(item));
    } else console.log('wrong command');
}
// TODO a
// TODO z
// TODO you can do it!

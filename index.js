const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function cutString (str, len) {
    let sliceStr = str.slice(0, len);
    return sliceStr === str ? str + ' '.repeat(len - str.length) : sliceStr.slice(0, len-3) + "...";
}

function tableFormat(value) {
    let userMaxLength = 4;
    let dateMaxLength = 4;
    let commentMaxLength = 7;
    const separator = ' | ';
    value.forEach(line => {
        const infoLine = line.split("; ");
        if (infoLine.length === 3) {
            userMaxLength = Math.max(userMaxLength, infoLine[0].length);
            dateMaxLength = Math.max(dateMaxLength, infoLine[1].length);
            commentMaxLength = Math.max(commentMaxLength, infoLine[2].length);
        } else {
            commentMaxLength = Math.max(commentMaxLength, infoLine[0].length);
        }
    });
    userMaxLength = Math.min(userMaxLength, 10);
    commentMaxLength = Math.min(commentMaxLength, 50);
    let result = value.map(line => {
        const infoLine = line.split('; ');
        if(infoLine.length === 3) {
            const important = infoLine[2].endsWith('!') ? '!' : ' ';
            infoLine[0] = cutString(infoLine[0], userMaxLength);
            infoLine[2] = cutString(infoLine[2], commentMaxLength);
            return important + separator + infoLine.join(separator);
        } else {
            const important = line[0].endsWith('!') ? '!' : ' ';
            infoLine[0] = cutString(infoLine[0], commentMaxLength);
            return important + separator + ' '.repeat(userMaxLength) + separator +
                ' '.repeat(10) + separator + infoLine[0];
        }
    });

    let userTitle = cutString('user', userMaxLength);
    let dateTitle = cutString('date', dateMaxLength);
    let commentTitle = cutString('comment', commentMaxLength);
    const title = '!' + separator + userTitle + separator + dateTitle + separator + commentTitle;
    const lineTitle = '-'.repeat(title.length);
    result.unshift(title, lineTitle);
    result.push(lineTitle);
    return result;
}

function processCommand(command) {
    let option = command.split(' ');
    switch (option[0]) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            console.log(tableFormat(show()));
            break;
        case 'important':
            console.log(tableFormat(important()));
            break;
        case 'user':
            console.log(tableFormat(user(option[1])));
            break;
        case 'date':
            console.log(tableFormat(date(option[1])));
            break;
        case 'sort':
            switch (option[1]) {
                case 'importance':
                    console.log(tableFormat(importanceSort()));
                    break;
                case 'user':
                    console.log(tableFormat(userSort()));
                    break;
                case 'date':
                    console.log(tableFormat(dateSort()));
                    break;
                default:
                    console.log('wrong command');
                    break;
            }
            break;
        default:
            console.log('wrong command');
            break;
    }
}

function show() {
    let result = [];
    files.map(code => code.split("\r\n")
        .filter(line => line.includes("// TODO ") && !line.includes("\"// TODO \"")))
        .forEach(t => t.forEach(line => result.push(line.split("// TODO ")[1])));
    return result;
}

function important() {
    return show().filter(line => line.endsWith("!"));
}

function user(userName) {
    return show().filter(line => line.toLowerCase().startsWith(`${userName.toLowerCase()};`));
}

function date(value) {
    return show().filter(variable => {
        let varInfo = variable.split("; ");
        if (varInfo.length === 3) return (varInfo[1] > value);
        return false;
    });
}

function importanceSort() {
    return show().sort((a, b) => b.split("!").length - a.split("!").length);
}

function userSort() {
    return show().sort((a, b) => {
        let nameA= a.toLowerCase(), nameB= b.toLowerCase()
        if (a.split("; ").length !== 1) {
            if (nameA < nameB)
                return -1
            if (nameA > nameB)
                return 1
            return 0;
        } else if (b.split(";").length === 1) {
            return -1;
        } else {
            return 0;
        }
    });
}

function dateSort() {
    return show().sort((a, b) => {
        let aInfo = a.split(";"), bInfo = b.split("; ");
        if (aInfo.length === 3) {
            if (aInfo[1] > bInfo[1])
                return -1;
            return aInfo[1] < bInfo[1] ? 1 : 0;
        } else return bInfo.length === 1 ? -1 : 0;
    });
}
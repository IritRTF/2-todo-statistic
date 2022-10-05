const { getAllFilePathsWithExtension, readFile } = require('./fileSystem');
const { readLine } = require('./console');

const files = getFiles();

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function sliceString(str, length) {
    var cuttedStr = str.slice(0, length);
    return cuttedStr === str ? str + ' '.repeat(length - str.length) : cuttedStr.slice(0, length - 3) + "...";
}

function textFormatter(val) {
    var maxUserLen = 4;
    var maxDateLen = 4;
    var maxCommentLen = 7;
    const sep = ' | ';
    val.forEach(row => {
        const info = row.split("; ");
        if (info.length === 3) {
            maxUserLen = Math.max(maxUserLen, info[0].length);
            maxDateLen = Math.max(maxDateLen, info[1].length);
            maxCommentLen = Math.max(maxCommentLen, info[2].length);
        } else {
            maxCommentLen = Math.max(maxCommentLen, info[0].length);
        }
    });
    maxUserLen = Math.min(maxUserLen, 10);
    maxCommentLen = Math.min(maxCommentLen, 50);
    var res = val.map(row => {
        const info = row.split('; ');
        if (info.length === 3) {
            const important = info[2].endsWith('!') ? '!' : ' ';
            info[0] = sliceString(info[0], maxUserLen);
            info[2] = sliceString(info[2], maxCommentLen);
            return important + sep + info.join(sep);
        } else {
            const important = row[0].endsWith('!') ? '!' : ' ';
            infoLine[0] = sliceString(infoLine[0], maxCommentLen);
            return important + sep + ' '.repeat(maxUserLen) + sep +
                ' '.repeat(10) + sep + infoLine[0];
        }
    });

    var userLabel = sliceString('user', maxUserLen);
    var dateLabel = sliceString('date', maxDateLen);
    var commentLabel = sliceString('comment', maxCommentLen);
    const header = '!' + sep + userLabel + sep + dateLabel + sep + commentLabel;
    const lineLabel = '-'.repeat(header.length);
    res.unshift(header, lineLabel);
    res.push(lineLabel);
    return res;
}

function processCommand(command) {
    var splittedCmd = command.split(' ');
    switch (splittedCmd[0]) {
        case 'exit':
            process.exit(0);
            break;
        case 'important':
            console.log(textFormatter(important()));
            break;
        case 'user':
            console.log(textFormatter(user(splittedCmd[1])));
            break;
        case 'show':
            console.log(textFormatter(show()));
            break;
        case 'date':
            console.log(textFormatter(date(splittedCmd[1])));
            break;
        case 'sort':
            switch (splittedCmd[1]) {
                case 'importance':
                    console.log(textFormatter(importanceSorted()));
                    break;
                case 'user':
                    console.log(textFormatter(userSorted()));
                    break;
                case 'date':
                    console.log(textFormatter(dateSorted()));
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

function important() {
    return show().filter(row => row.endsWith("!"));
}

function user(userName) {
    return show().filter(row => row.toLowerCase().startsWith(`${userName.toLowerCase()};`));
}

function show() {
    var res = [];
    files.map(t => t.split("\r\n")
            .filter(row => row.includes("// TODO ") && !row.includes("\"// TODO \"")))
        .forEach(t => t.forEach(row => res.push(row.split("// TODO ")[1])));
    return res;
}

function userSorted() {
    return show().sort((x, y) => {
        var xName = x.toLowerCase(),
            yName = y.toLowerCase()
        if (x.split("; ").length !== 1) {
            if (xName < yName)
                return -1
            if (xName > yName)
                return 1
            return 0;
        } else if (y.split(";").length === 1) {
            return -1;
        } else {
            return 0;
        }
    });
}

function dateSorted() {
    return show().sort((x, y) => {
        var xInfo = x.split(";"),
            yInfo = y.split("; ");
        if (xInfo.length === 3) {
            if (xInfo[1] > yInfo[1])
                return -1;
            return xInfo[1] < yInfo[1] ? 1 : 0;
        } else return yInfo.length === 1 ? -1 : 0;
    });
}

function date(val) {
    return show().filter(element => {
        var elementInfo = element.split("; ");
        if (elementInfo.length === 3) return (elementInfo[1] > val);
        return false;
    });
}

function importanceSorted() {
    return show().sort((x, y) => y.split("!").length - x.split("!").length);
}

// TODO you can do it!
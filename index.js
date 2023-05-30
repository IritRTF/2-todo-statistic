const {getAllFilePathsWithExtension, readFile} = require('./fileSystem')
const {readLine} = require('./console')
const globalExpr = '//' + ' TODO' // Для того чтобы в поиск не попадало
const exp = require('constants')

const files = getFiles()

console.log('Please, write your command!')
readLine(processCommand)

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js')
    return filePaths.map(path => readFile(path))
}

function checkEntries(text) {
    return text === '_WitoutEntries' ? '' : text
}

function fString(text, maxSymbols) {
    if (text.length > maxSymbols) {
        return text.slice(0, maxSymbols - 3) + '...'
    } else {
        return text.padEnd(maxSymbols)
    }
}

function getTextLengthOrMax(text, max) {
    if (text.length > max) return max; else return text.length;
}

function showTodo(arr) {
    if (arr.length !== 0) {
        const maxUserField = 10;
        const maxDateField = 10;
        const maxCommentField = 50;
        let userFieldLength = 0;
        let commentFieldLength = 0;
        let result = []

        for (let i = 0; i < arr.length; i++) {
            const parsedText = parseComment(arr[i])
            const user = checkEntries(parsedText.user)
            const comment = checkEntries(parsedText.comment)
            userFieldLength = getTextLengthOrMax(user, maxUserField) < userFieldLength ?
                userFieldLength :
                getTextLengthOrMax(user, maxUserField)
            commentFieldLength = getTextLengthOrMax(comment, maxCommentField) < commentFieldLength ?
                commentFieldLength :
                getTextLengthOrMax(comment, maxCommentField)
        }

        for (let i = 0; i < arr.length; i++) {
            const parsedText = parseComment(arr[i])
            const user = checkEntries(parsedText.user)
            const date = checkEntries(parsedText.date)
            const comment = checkEntries(parsedText.comment)
            const importantPoints = comment.indexOf('!') < 0 ? ' ' : '!'
            result.push(` ${importantPoints}  |  ` +
                `${fString(user, userFieldLength)}  |  ` +
                `${fString(date, maxDateField)}  |  ` +
                `${fString(comment, commentFieldLength)}`)
        }
       
        console.log(` !  |  ` + `${fString('user', userFieldLength)}  |  ` +
            `${fString('date', maxDateField)}  |  ` +
            `${fString('comment', commentFieldLength)}`)
        console.log(`${'-'.repeat(result[0].length)}`)
        result.forEach(element => console.log(element))
        console.log(`${'-'.repeat(result[0].length)}`)
    }
}

function getTODOs(arr = [], contains = '', expr = [globalExpr]) {
    const elements = []
    for (let i = 0; i < arr.length; i++) {
        for (let exprNumb = 0; exprNumb < expr.length; exprNumb++) {
            let cursorIndex = arr[i].indexOf(expr[exprNumb])
            while (cursorIndex > 0) {
                const endStringIndex = files[i].indexOf('\n', cursorIndex)
                const substring = files[i].substring(cursorIndex, endStringIndex)
                if (contains.length > 0) 
                    if (substring.includes(contains)) elements.push(substring)
                else {
                    elements.push(substring)
                }

                cursorIndex = arr[i].indexOf(expr, endStringIndex)
            }
        }
    }
    return elements
}

function commandParse(command) {
    const splitedCommand = command.split(' ')
    return {
        command: splitedCommand.length > 1 ? splitedCommand[0] : String(splitedCommand),
        param: splitedCommand.length > 1 ? splitedCommand[1].trim() : ''
    }
}

function countSymbolInText(text, symbol) {
    let counter = 0;
    for (let i = 0; i < text.length; i++) {
        if (text[i] === symbol) {
            counter++;
        }
    }
    return counter;
}

function sortByImportant(array) {
    const importantPriority = {}
    let maxCount = 0
    for (let i = 0; i < array.length; i++) {
        let pointCount = countSymbolInText(array[i], '!')
        maxCount < pointCount ? maxCount = pointCount : undefined

        if (pointCount in importantPriority) {
            importantPriority[pointCount].push(array[i])
        } else {
            importantPriority[pointCount] = [array[i]]
        }

        const result = []
        for (let i = maxCount; i >= 0; i--) {
            if (i in importantPriority) {
                importantPriority[i].forEach(element => {
                    result.push(element)
                })
            } else {
                continue
            }
        }
        return result
    }
}

function parseComment(str) {
    const splitedComment = str.slice(globalExpr.length).split(';')
    return {
        'comment': splitedComment.length > 1 ?
            splitedComment[2].trim() :
            splitedComment[0].trim(),
        'user': splitedComment.length > 1 ?
            splitedComment[0].trim()[0].toUpperCase() + splitedComment[0].trim().slice(1).toLowerCase() :
            '_WitoutEntries',
        'date': splitedComment.length > 1 ? splitedComment[1].trim() : '_WitoutEntries'
        // 'commentLength': splitedComment.length > 1 ? splitedComment[2].trim().lentgh : splitedComment[0].trim().length,
        // 'userLength': splitedComment.length > 1 ? splitedComment[0].trim().length : 0
    }
}

function creteObjectByField(array, field) {
    const obj = {}
    array.forEach(element => {
        const parsedText = parseComment(element)
        if (parsedText[field] in obj) {
            obj[parsedText[field]].push(element)
        } else {
            obj[parsedText[field]] = []
            obj[parsedText[field]].push(element)
        }
    })
    return obj
}

function sortByUsers(array) {
    const users = creteObjectByField(array, 'user')
    const result = []
    Object.keys(users).sort().forEach(element => {
        users[element].forEach(item => {
            result.push(item)
        })
    })
    return result
}

function sortByDate(array) {
    const dates = creteObjectByField(array, 'date')
    let result = []
    Object.keys(dates).sort((obj1, obj2) =>
        Number(new Date(obj2)) - Number(new Date(obj1))).forEach(element => {
            dates[element].forEach(comment => {
                result.push(comment)
            })
        })
    return result
}

function sortBy(array, sortBy) {
    switch (sortBy) {
        case 'important':
            return sortByImportant(array)
        case 'date':
            return sortByDate(array)
        case 'user':
            return sortByUsers(array)
    }
}


function nextDate(date) {
    const pasedDate = date.split('-')
    let newDate = new Date(date)
    if (pasedDate.length === 1) {
        newDate.setFullYear(newDate.getFullYear() + 1)
    } else if (pasedDate.length === 2) {
        newDate.setMonth(newDate.getMonth() + 1)
    } else if (pasedDate.length === 3) {
        newDate.setDate(newDate.getDate() + 1)
    }
    return newDate
}

function commentsAfterDate(array, date) {
    let result = []
    const dates = creteObjectByField(array, 'date')
    let afterDate = nextDate(date)
    Object.keys(dates).forEach(element => {
        if (new Date(element) >= afterDate) {
            dates[element].forEach(comment => {
                result.push(comment)
            })
        }
    })
    return result
}

function processCommand(str) {
    const parse = commandParse(str)
    const command = parse.command
    const param = parse.param

    switch (command) {
        case 'exit':
            process.exit(0)
            break
        case 'show':
            showTodo(getTODOs(files))
            break
        case 'important':
            showTodo(getTODOs(files, '!'))
            break
        case 'user':
            const expressions = [`${globalExpr} ${param.toUpperCase()}`,
                `${globalExpr} ${param[0].toUpperCase()}${param.slice(1).toLowerCase()}`,
                `${globalExpr} ${param.toLowerCase()}`]
            showTodo(getTODOs(files, '', expressions))
            break
        case 'sort':
            showTodo(sortBy(getTODOs(files), param))
            break
        case 'date':
            showTodo(commentsAfterDate(getTODOs(files), param))
            break
        default:
            console.log('wrong command')
            break
    }
}

// TODO you can do it!

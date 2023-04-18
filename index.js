const { getAllFilePathsWithExtension, readFile } = require('./fileSystem')
const { readLine } = require('./console')
const globalExpr = '//' + ' TODO' // Для того чтобы в поиск не попадало
const exp = require('constants')

const files = getFiles()

console.log('Please, write your command!')
readLine(processCommand)

function getFiles () {
  const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js')
  return filePaths.map(path => readFile(path))
}

function showTodo (arr) {
  for (let i = 0; i < arr.length; i++) {
    console.log(arr[i])
  }
}

function getTODOs (arr = [], contains = '', expr = [globalExpr]) {
  const elements = []
  for (let i = 0; i < arr.length; i++) {
    for (let exprNumb = 0; exprNumb < expr.length; exprNumb++) {
      let cursorIndex = arr[i].indexOf(expr[exprNumb])
      while (cursorIndex > 0) {
        const endStringIndex = files[i].indexOf('\n', cursorIndex)
        const substring = files[i].substring(cursorIndex, endStringIndex)
        if (contains.length > 0) {
          if (substring.includes(contains)) {
            elements.push(substring)
          }
        } else {
          elements.push(substring)
        }

        cursorIndex = arr[i].indexOf(expr, endStringIndex)
      }
    }
  }
  return elements
}

function commandParse (command) {
  const splitedCommand = command.split(' ')
  return {
    command: splitedCommand.length > 1 ? splitedCommand[0] : String(splitedCommand),
    param: splitedCommand.length > 1 ? splitedCommand[1].trim() : ''
  }
}

function sortByImportant (array) {
  const importantPriority = {}
  let maxCount = 0
  for (let i = 0; i < array.length; i++) {
    let counter = 0
    for (let symbolIndex = 0; symbolIndex < array[i].length; symbolIndex++) {
      if (array[i][symbolIndex] === '!') {
        counter++
      }
      if (maxCount < counter) {
        maxCount = counter
      }
    }
    if (counter in importantPriority) {
      importantPriority[counter].push(array[i])
    } else {
      importantPriority[counter] = [array[i]]
    }
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

function parseComent (str) {
  const splitedComment = str.slice(globalExpr.length).split(';')
  return {
    'comment': splitedComment.length > 1 ? splitedComment[2].trim() : splitedComment[0],
    'user': splitedComment.length > 1
      ? splitedComment[0].trim()[0].toUpperCase() +
        splitedComment[0].trim().slice(1).toLowerCase()
      : '_WitoutEntries',
    'date': splitedComment.length > 1 ? splitedComment[1].trim() : '_WitoutEntries'
  }
}

function creteObjectByField(array, field){
    const obj = {}
    array.forEach(element => {
        const parsedComent = parseComent(element)
        if (parsedComent[field] in obj){
            obj[parsedComent[field]].push(element)
        } else {
            obj[parsedComent[field]] = []
            obj[parsedComent[field]].push(element)
        }
    })
    return obj
}

function sortByUsers (array) {
  const users = creteObjectByField(array, 'user')
  const result = []
  Object.keys(users).sort().forEach(element => {
    users[element].forEach(item => {
      result.push(item)
    })
  })
  return result
}

function sortByDate (array) {
    const dates = creteObjectByField(array, 'date')
    let result = []
    Object.keys(dates).sort((obj1, obj2) => Number(new Date(obj2))- Number(new Date(obj1))).forEach(element => {
        dates[element].forEach(comment => {
            result.push(comment)
        })
    })
    return result
}

function sortBy (array, sortBy) {
  switch (sortBy) {
    case 'important':
      return sortByImportant(array)
    case 'date':
      return sortByDate(array)
    case 'user':
      return sortByUsers(array)
  }
}

function processCommand (str) {
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
      const expressions = [
                `${globalExpr} ${param.toUpperCase()}`,
                `${globalExpr} ${param[0].toUpperCase()}${param.slice(1).toLowerCase()}`,
                `${globalExpr} ${param.toLowerCase()}`]
      showTodo(getTODOs(files, '', expressions))
      break
    case 'sort':
      showTodo(sortBy(getTODOs(files), param))
      break
    default:
      console.log('wrong command')
      break
  }
}

// TODO you can do it!

const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');
const { log } = require('console');
const path = require('node:path');

const files = getFiles();

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(filePath => ({
        file: path.parse(filePath).base,
        content: readFile(filePath),
    }));
}

// parsing data
function parseTodos(file) {
    const { file: filename, content } = file;
    const grouppedRE = /\/\/\sTODO\s((?<user>[A-Za-zА-Яа-я\s]+);)?\s?((?<date>\d{4}-\d{2}-\d{2});)?\s?(?<todo>.*)/gm;
    const matches = [];
    let match;
    while ((match = grouppedRE.exec(content)) !== null) {
        matches.push({
            ...match.groups,
            importance: (match.groups.todo.match(/!/g) || []).length,
            file: filename,
        });
    }
    return matches;
}
function getTodos() {
    const files = getFiles();
    return files.reduce((acc, file) => {
        acc.push(...parseTodos(file));
        return acc;
    }, []);
}


// commands processing
const outputCommands = {
    show: commandShow,
    important: commandImportant,
    user: commandUser,
    sort: commandSort,
    date: commandDate,
};
function processCommand(command) {
    switch (command) {
        case 'exit':
            process.exit(0);
            break;
        default:
            const [ cmd, args ] = command.split(' ');
            if (cmd in outputCommands) {
                const todos = getTodos();
                outputCommands[cmd](todos, args);
            } else console.log('wrong command');
            break;
    }
}
// output commands
function commandShow(todos) {
    showTable(todos);
}
function commandImportant(todos) {
    showTable(todos.filter(todo => todo.importance > 0));
}
function commandUser(todos, ...args) {
    const [user] = args;
    if (user) showTable(todos.filter(todo => todo.user && todo.user.toLowerCase() === user.toLowerCase()));
}
function commandSort(todos, ...args) {
    const [sortBy] = args;
    switch (sortBy) {
        case 'importance':
            showTable([...todos].sort((a, b) => b.importance - a.importance));
            break;
        case 'user':
            showTable([...todos].sort((a, b) => (a?.user?.toLowerCase() ?? '') < (b?.user?.toLowerCase() ?? '') ? -1 : 1));
            break;
        case 'date':
            showTable([...todos].sort((a, b) => new Date(b.date || '') - new Date(a.date || '')));
            break;
        default:
            console.log('Wrong sorting argument. Use argument: importance | user | date');
            break;
    }
}
function commandDate(todos, ...args) {
    const [date] = args;
    const dateParsed = Date.parse(date);
    if (dateParsed)  
        showTable(todos.filter(todo => todo.date && new Date(todo.date) > dateParsed));
    else console.log('Wrond date argument. Use format {yyyy[-mm[-dd]]}');
}

// presentational functions
function showTable(todos) {
    const lensConfig = { imp: 1, user: 10, date: 10, todo: 50, file: 20 };
    const lens = todos.reduce((acc, item) => {
        acc.user = Math.min(Math.max(item.user?.length || 0, acc.user), lensConfig.user);
        acc.todo = Math.min(Math.max(item.todo?.length || 0, acc.todo), lensConfig.todo);
        return acc;
    }, {...lensConfig});
    const tableHead = getFormattedTableRow([
        { value: '!', len: lens.imp },
        { value: 'user', len: lens.user },
        { value: 'date', len: lens.date },
        { value: 'comment', len: lens.todo },
        { value: 'file', len: lens.file },
    ]);
    console.log(tableHead);
    console.log('-'.repeat(tableHead.length));
    todos.length 
        ? todos.forEach(todo => {
            console.log(getFormattedTableRow([
                { value: todo.importance > 0 ? '!' : '', len: lens.imp },
                { value: todo.user ?? '', len: lens.user },
                { value: todo.date ?? '', len: lens.date },
                { value: todo.todo ?? '', len: lens.todo },
                { value: todo.file, len: lens.file },
            ]));
        }) 
    : console.log('No results found');
    console.log('-'.repeat(tableHead.length));
}
function getFormattedTableRow(row) {
    const ss = ' '.repeat(2);
    const cells = row
        .map(cell => cell.value.length <= cell.len ? cell.value.padEnd(cell.len, ' ') : cell.value.substr(0, cell.len - 3) + '...')
        .join(ss + '|' + ss)
    return ss + cells + ss;
}

// TODO you can do it!

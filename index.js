const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();

console.log('Please, write your command!');
readLine(processCommand('date 2018'));

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return( filePaths.map(path => readFile(path)));
}

function processCommand(command) {
    command = command.split(' ');
    switch (command[0]) {
        case 'exit':
            process.exit(0);
            break; 
        case 'show':
            console.log(findTODO().map(x=>x.full));
            break
        case 'important':
            console.log(findTODO().map(x=>x.full).filter(x=>(x.includes('!'))))
            break
        case 'user':
            console.log(findTODO().map(x=>x.full).filter(x => x.toLowerCase().includes(command[1].toLowerCase()+';')))
            break
        case 'sort':
            console.log(SortTODO(command[1]).map(x=>x.full))
            break
        case 'date':
            console.log(findTODO().map(x=>x.full).filter(x => x.includes(command[1])))
            break    
    }
}
function findTODO(){
  let Allinfo=[]
  for (let file of files){
    Todolines = file.split("\r\n").filter(x => (x.includes('// TODO ')) & !(x.includes('\'// TODO \'')));
    for (line of Todolines){
        let podline = line.substring(line.indexOf('// TODO ')+'// TODO '.length).split(';');
        let objinfo = {            
            important: line.split('!').length,
            full: line.substring(line.indexOf('// TODO ')),
            user: podline[0],   
            date: Date.parse(podline[1])
        }
        Allinfo.push(objinfo)
    }
  }
  return Allinfo
}
function SortTODO(typesort){
    switch (typesort){
        case 'importance':
            return findTODO().sort((a,b)=>b.important-a.important)
        case 'user':
            return findTODO().sort((a,b) => b.full.includes(';')-a.full.includes(';'))
        case 'date':
            return findTODO().sort((a,b)=>b.date-a.date)
    }
}


// TODO you can do it!

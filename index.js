String.prototype.lastIndexOfEnd = function(string) {
    var io = this.lastIndexOf(string);
    return io == -1 ? -1 : io + string.length;
}
const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();

console.log('Please, write your command!');
readLine(processCommand('show'));

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return( filePaths.map(path => readFile(path)));
}
function tabl(s){
    let tab=[]
    let vosk=''
    for(let i of s){
        for(let char of i){
            if (char=='!'){

                vosk=vosk.concat('!')
            }
        }
        let obj= new Object()
        obj.user=(i.substr(i.indexOf('TODO')+5,(i.indexOf(';')-i.indexOf('TODO')-5)))
        obj.date=(i.substr(i.indexOf(';')+2,11))
        obj.comment=(i.substr(i.lastIndexOfEnd(';'),i.length-i.lastIndexOfEnd(';')))
        obj.voskl=vosk
        vosk=''
        tab.push(obj)
    }
    console.table(tab)
}
function processCommand(command) {
    
    command = command.split(' ');
    switch (command[0]) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            s = findTODO().map(x=>x.full)
            tabl(s)
            break
        case 'important':
            s = findTODO().map(x=>x.full).filter(x=>(x.includes('!')))
            tabl(s)
            break
        case 'user':
            s = findTODO().map(x=>x.full).filter(x => x.toLowerCase().includes(command[1].toLowerCase()+';'))
            tabl(s)
            break
        case 'sort':
            s = SortTODO(command[1]).map(x=>x.full)
            tabl(s)
            break
        case 'date':
            s = findTODO().map(x=>x.full).filter(x => x.includes(command[1]))
            tabl(s)
            break    
    }
}
//console.log(findTODO()[1])
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

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
    let position=command.indexOf(' ')
    let cmd = (position == -1)? command:command.substring(0,position)
    let val=(position == -1)? null:command.substring(position+1)
    switch (cmd) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            makeTable(getTODO(files,/\/\/ TODO.*\n/g))
            break;
        case 'important':
            makeTable(getTODO(files,/\/\/ TODO.*!.*\n/g))
            break
        case 'user':
            makeTable(getTODO(files,new RegExp(`\\/\\/ TODO ${val};.*\n`,'gi')))
            break;
        case 'sort':
            switch(val){
                case 'importance':
                    makeTable(sortImportance(getTODO(files,/\/\/ TODO.*\n/g)))
                    break;
                case 'user':
                    makeTable(sortUser(getTODO(files,/\/\/ TODO.*\n/g)))
                    break
                case 'date':
                    makeTable(sortDate(getTODO(files,/\/\/ TODO.*\n/g)))
                    break
            }
            break;
        case 'date':
            makeTable(dateTODO(sortDate(getTODO(files,/\/\/ TODO.*\n/g)),val))
            break
        default:
            console.log('wrong command');
            break;
    }
}

function getTODO(strArr,template){
    let res=[]
    for(let i=0;i<strArr.length;i++){
        let arr=strArr[i].match(template)
        if(arr!==null)
            res=res.concat(arr)
    }
    return res
}

function sortImportance(arr){
    let arrCouple =[[]]
    for(let i=0;i<arr.length;i++){
        let count=0
        for(let j=0;j<arr[i].length;j++){
            if(arr[i][j]=='!')
                count++
        }
        arrCouple[i]=new Array()
        arrCouple[i][0]=arr[i]
        arrCouple[i][1]=count
    }
    arrCouple.sort(function compare(a,b){
        return b[1]-a[1]
    })
    for(let i=0;i<arrCouple.length;i++){
        arr[i]=arrCouple[i][0]
    }
    return arr
}

function sortUser(arr){
    let arrCouple =[[]]
    for(let i=0;i<arr.length;i++){
        let user=arr[i].match(/ TODO\s+.*;/)
        arrCouple[i]=new Array()
        arrCouple[i][0]=arr[i]
        arrCouple[i][1]=(user==null)?null:user[0]
    }
    arrCouple.sort(function compare(a,b){
        if(a[1]==null && b[1]==null)
            return 0
        if(b[1]==null)
            return -1
        if(a[1]==null)
            return 1
        return (b[1].toUpperCase()>a[1].toUpperCase())? -1:(b[1].toUpperCase()==a[1].toUpperCase())? 0:1
    })
    for(let i=0;i<arrCouple.length;i++){
        arr[i]=arrCouple[i][0]
    }
    return arr
}

function sortDate(arr){
    let arrCouple =[[]]
    for(let i=0;i<arr.length;i++){
        let date=arr[i].match(/;.*;/)
        arrCouple[i]=new Array()
        arrCouple[i][0]=arr[i]
        arrCouple[i][1]=(date==null)?null:date[0]
    }
    arrCouple.sort(function compare(a,b){
        if(a[1]==null && b[1]==null)
            return 0
        if(b[1]==null)
            return -1
        if(a[1]==null)
            return 1
        return (b[1]>a[1])? -1:(b[1]==a[1])? 0:1
    })
    for(let i=0;i<arrCouple.length;i++){
        arr[i]=arrCouple[i][0]
    }
    return arr
}

function dateTODO(arr,str){
    let result=[]
    for(let i=0;i<arr.length;i++) {
        let dateStr=''
        let date = arr[i].match(/;.*;/)
        if(date!=null)
            dateStr=date[0].substring(2,date[0].length-1)
        if(dateStr>str){
            result.push(arr[i])
        }
    }
    return result
}

function makeTable(arr){
    let userArr=[]
    let dateArr=[]
    let commentArr=[]
    let userMax=4
    let dateMax=4
    let commentMax=7
    for(let i=0;i<arr.length;i++){
        let arrStr=arr[i].split(';')
        let user=''
        let date=''
        let comment=''
        if(arrStr.length==3){
            user=arrStr[0].substring(8)
            date=arrStr[1].substring(1)
            comment=arrStr[2].substring(1,arrStr[2].length-1)
        }
        else{
            comment=arrStr[0].substring(8,arrStr[0].length-1)
        }
        userArr.push(user)
        dateArr.push(date)
        commentArr.push(comment)
        if(user.length>userMax)
            userMax=user.length
        if(date.length>dateMax)
            dateMax=date.length
        if(comment.length>commentMax)
            commentMax=comment.length
    }
    if(userMax>10)
        userMax=10
    if(dateMax>10)
        dateMax=10
    if(commentMax>50)
        commentMax=50
    let header='!  |  '+'user'.padEnd(userMax)+'  |  '+'date'.padEnd(dateMax)+'  |  '+'comment'
    console.log(header)
    let line='-'.repeat(17+userMax+dateMax+commentMax)
    console.log(line)
    for(let i=0;i<arr.length;i++) {
        let table = ''
        if (arr[i].includes('!')) {
            table += '!  |  '
        } else {
            table += '   |  '
        }
        if(userArr[i].length<=userMax){
            table+=userArr[i].padEnd(userMax)
        }
        else{
            table+=userArr[i].substring(0,userMax-3)+'...'
        }
        table+='  |  '+dateArr[i].padEnd(dateMax)+'  |  '
        if(commentArr[i].length<=commentMax){
            table+=commentArr[i]
        }
        else{
            table+=commentArr[i].substring(0,commentMax-3)+'...'
        }
        console.log(table)
    }
    console.log(line)
}
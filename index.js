const { getAllFilePathsWithExtension, readFile } = require("./fileSystem");
const { readLine } = require("./console");

const files = getFiles();

console.log("Please, write your command!");
readLine(processCommand);

function getFiles() {
  const filePaths = getAllFilePathsWithExtension(process.cwd(), "js");
  return filePaths.map((path) => readFile(path));
}
function todos() {
  const todoComments = [];

  for (const file of files) {
    const lines = file.split("\n");

    for (const line of lines) {
      const match = line.match(/\/\/\s*TODO\s+(.+)$/);

      if (match) {
        const comment = match[1];
        todoComments.push(comment);
      }
    }
  }

  return todoComments;
}
function important() {
  const arr = todos();
  const filteredArr = arr.filter((e) => {
    let lastChar = e.split("").pop();
    if (lastChar === "!") {
      return true;
    } else {
      return false;
    }
  });
  return filteredArr;
}
function user(name = "") {
  if (name === "") return;

  const userTodo = todos().filter((line) =>
    line.toLowerCase().startsWith(`${name.toLowerCase()};`)
  );
  const arrStr = userTodo.map((todo) => {
    const str = todo.split(";")[2].trim();
    return str;
  });

  return arrStr;
}
function importanceSort() {
  return todos().sort((a, b) => b.split("!").length - a.split("!").length);
}
function userSort() {
  return todos().sort((a, b) => {
    const nameA = a.split(";")?.[0];
    const nameB = b.split(";")?.[0];

    if (nameA && !nameB) {
      return -1;
    } else if (!nameA && nameB) {
      return 1;
    } else if (nameA && nameB) {
      return nameA.toLowerCase().localeCompare(nameB.toLowerCase());
    } else {
      return 0;
    }
  });
}
function dateSort() {
  return todos().sort((a, b) => {
    const dateA = new Date(a.split(";")[1]);
    const dateB = new Date(b.split(";")[1]);

    if (!dateA && !dateB) {
      return 0;
    } else if (!dateA) {
      return 1;
    } else if (!dateB) {
      return -1;
    } else {
      return dateB.getTime() - dateA.getTime();
    }
  });
}
function processCommand(command) {
  let details = command.split(" ");

  switch (details[0]) {
    case "exit":
      process.exit(0);
      break;
    case "show":
      console.log(todos());
      break;
    case "important":
      console.log(important());
      break;
    case "user":
      console.log(user(details[1]));
      break;
    case "sort":
      switch (details[1]) {
        case "importance":
          console.log(importanceSort());
          break;
        case "user":
          console.log(userSort());
          break;
        case "date":
          console.log(dateSort());
          break;
      }
      break;
    default:
      console.log("wrong command");
      break;
  }
}

// TODO you can do it!

function readLine(callback) {
  process.stdin.setEncoding("utf8"); // TODO pe; 2015-08-10; почему кодировка только utf?

  process.stdin.on("readable", () => {
    const chunk = process.stdin.read();
    if (chunk !== null) {
      const line = chunk.trim();
      callback(line);
    }
  });
}

// TODO digi; 2016-04-08; добавить writeLine!!!

module.exports = {
  readLine,
};

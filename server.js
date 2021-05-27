// imports modules
const url = require('url'),
  http = require('http'),
  fs = require('fs');

// parse URL into readable strings
http.createServer((request, response) => {
  let addr = require.url,
    q = url.parse(addr, true),
    filePath = '';
  
  // logs all requests to server (\n are line breaks)  
  fs.appendFile('log.txt', 'URL: ' + addr + '\nTime stamp: ' + new Date() + '\n\n', (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log('Added to log.')
    }
  });

  // determines which file to go to
  if (q.pathname.includes('documentation')) {
    filePath = (__dirname + '/documentation.html');
  } else {
    filePath = 'index.html';
  }

  // fs module used to grab file from server
  fs.readFile(filePath, (err, data) => {
    if (err) {
      throw err;
    }

    response.writeHead(200, { 'Content-Type': 'text/html' });
    response.write(data);
    response.end();
  })


}).listen(8080);
console.log('My first Node test server is running on Port 8080.');

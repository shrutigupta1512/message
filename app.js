const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
  const url = req.url;
  const method = req.method;
  
  // Read messages from the file if it exists
  if (url === '/') {
    fs.readFile('message.txt', (err, data) => {
      let message = 'No message available';
      if (!err && data.length > 0) {
        message = data.toString();
      }
      
      res.write('<html>');
      res.write('<head><title>Enter Message</title><head>');
      res.write(`<body><p>${message}</p><form action="/message" method="POST"><input type="text" name="message"><button type="submit">Send</button></form></body>`);
      res.write('</html>');
      return res.end();
    });
  }

  if (url === '/message' && method === 'POST') {
    const body = [];
    req.on('data', (chunk) => {
      body.push(chunk);
    });
    req.on('end', () => {
      const parsedBody = Buffer.concat(body).toString();
      const message = parsedBody.split('=')[1];
      fs.writeFile('message.txt', message, (err) => {
        res.statusCode = 302;
        res.setHeader('Location', '/');
        return res.end();
      });
    });
  }
});

server.listen(7000, () => {
  console.log('Server is running on port 7000');
});

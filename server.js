const express = require('express');
const serveStatic = require('serve-static');
// const path = require('path');
// const url = require('url');

const app = express();

// const db = require('./models');
// db.sequelize.sync({ force: true }).then(() => {
//   console.log('Drop and re-sync db.');
// });

// Configuring dist to serve app files
// app.use('/', serveStatic(path.join(__dirname, '/dist')));

// app.get(/.*/, function (req, res) {
//   const request = url.parse(req.url);
//   if (request.pathname == '/game-data') {
//     res.send('success');
//   }
//   res.sendFile(path.join(__dirname, '/dist/index.html'));

// });

app.get('/jack', (req, res) => {
  console.log("I have loaded!");
});




const port = process.env.PORT || 8080;
app.listen(port);

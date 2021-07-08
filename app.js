require('dotenv').config();
// Express webserver
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
// Express Routes

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.listen(port, function (req, res) {
  console.log('Listening on port ' + port);
});

// Mongoose connection to MongoDB

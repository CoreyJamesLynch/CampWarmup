require('dotenv').config();

const express = require('express');
const methodOverride = require('method-override');
const app = express();
const port = process.env.PORT || 3000;
const path = require('path');

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Mongoose connection to MongoDB
const database = process.env.MONGODB_URI;
const mongoose = require('mongoose');
mongoose.connect(database, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log(`Connected to ${database}`);
});

// Express Routes
app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.listen(port, function (req, res) {
  console.log('Listening on port ' + port);
});

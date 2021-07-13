require('dotenv').config();

const express = require('express');
const methodOverride = require('method-override');
const engine = require('ejs-mate');
const app = express();
const port = process.env.PORT || 3000;
const path = require('path');
const Campground = require('./models/campground');

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.engine('ejs', engine);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

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

app.delete('/campgrounds/:id', async (req, res) => {
  const campground = await Campground.findByIdAndRemove(req.params.id);
  res.redirect('/campgrounds');
});

app.get('/campgrounds/:id/edit', async (req, res) => {
  const id = req.params.id;
  const campground = await Campground.findById(id);
  res.render('campgrounds/edit', { campground });
});

app.patch('/campgrounds/:id', async (req, res) => {
  const id = req.params.id;
  const campground = await Campground.findByIdAndUpdate(id, req.body);
  res.redirect(`/campgrounds/${id}`);
});

app.get('/campgrounds/:id', async (req, res) => {
  const id = req.params.id;
  const campground = await Campground.findById(id);
  res.render('campgrounds/show', { campground });
});

app.get('/campgrounds/new', (req, res) => {
  res.render('campgrounds/new');
});

app.put('/campgrounds', (req, res) => {
  const campground = new Campground({
    title: req.body.title,
    location: req.body.location,
  });
  campground.save((err) => {
    if (err) {
      res.send(err);
    }
    res.redirect('/campgrounds');
  });
});

app.get('/campgrounds', async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render('campgrounds/index', { campgrounds });
});

app.get('/', function (req, res) {
  res.render('home');
});

app.listen(port, function (req, res) {
  console.log('Listening on port ' + port);
});

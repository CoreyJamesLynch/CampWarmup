require('dotenv').config();

const express = require('express');
const methodOverride = require('method-override');
const engine = require('ejs-mate');

const app = express();
const port = process.env.PORT || 3000;
const path = require('path');
const Campground = require('./models/campground');
const catchAsync = require('./Utilities/catchAsync');

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

app.get('/campgrounds/new', (req, res) => {
  res.render('campgrounds/new');
});

app.delete(
  '/campgrounds/:id',
  catchAsync(async (req, res, next) => {
    const campground = await Campground.findByIdAndRemove(req.params.id);
    res.redirect('/campgrounds');
  }),
);

app.get(
  '/campgrounds/:id/edit',
  catchAsync(async (req, res, next) => {
    const id = req.params.id;
    const campground = await Campground.findById(id);
    res.render('campgrounds/edit', { campground });
  }),
);

app.patch(
  '/campgrounds/:id',
  catchAsync(async (req, res, next) => {
    const id = req.params.id;
    const campground = await Campground.findByIdAndUpdate(
      id,
      req.body.campground,
    );
    res.redirect(`/campgrounds/${id}`);
  }),
);

app.get(
  '/campgrounds/:id',
  catchAsync(async (req, res, next) => {
    const id = req.params.id;
    const campground = await Campground.findById(id);
    res.render('campgrounds/show', { campground });
  }),
);

app.post(
  '/campgrounds',
  catchAsync(async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
  }),
);

app.get(
  '/campgrounds',
  catchAsync(async (req, res, next) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
  }),
);

app.get('/', function (req, res) {
  res.render('home');
});

app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(port, function (req, res) {
  console.log('Listening on port ' + port);
});

require('dotenv').config();
const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities');
const { descriptors, places } = require('./seedHelpers');

const database = process.env.MONGODB_URI;
const db = mongoose.connection;

mongoose.connect(database, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log(`Connected to ${database}`);
});

const seedDb = async () => {
  await Campground.deleteMany({});
  const campground = new Campground({
    title: 'Campground 1',
    location: 'Somewhere',
  });
  await campground.save();
};

seedDb();

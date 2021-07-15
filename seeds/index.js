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
  for (let idx = 0; idx < 50; idx += 1) {
    const city = cities[Math.floor(Math.random() * cities.length)].city;
    const state = cities[Math.floor(Math.random() * cities.length)].state;
    const descriptor =
      descriptors[Math.floor(Math.random() * descriptors.length)];
    const place = places[Math.floor(Math.random() * places.length)];

    const campground = new Campground({
      title: `${descriptor} ${place}`,
      location: `${city}, ${state}`,
      image: 'https://source.unsplash.com/collection/483251',
      description: "Maybe there's a happy little waterfall happening over here",
      price: Math.floor(Math.random() * 100),
    });

    await campground.save();
  }
};

seedDb().then(() => {
  mongoose.connection.close();
  console.log('Seeding complete!');
});

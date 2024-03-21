const mongoose = require('mongoose');
require('dotenv').config();

; (async () => {
  await mongoose.connect(`${process.env.MONGODB_URL}`)
    .then(() => { console.log('MongoDB Connected'); })
    .catch((err) => { console.log('MongoDB Connection FAILED ', err); });
})();

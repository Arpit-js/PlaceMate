const mongoose = require('mongoose');

const connectMongoose = async () => {
  const uri = process.env.MONGODB_URI; 
  if (!uri) throw new Error('MongoDB URI is not defined in .env');
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

module.exports = connectMongoose;

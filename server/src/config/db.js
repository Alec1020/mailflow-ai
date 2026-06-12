const mongoose = require('mongoose');

// const MONGO_USER = encodeURIComponent(`successpilotai2050_db_user`);
// const MONGO_PASSWORD = encodeURIComponent(`Virus!)@)1209`);

const connectDB = async () => {
    try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected ✅');
  } catch (err) {
    console.error('MongoDB connection failed ❌', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
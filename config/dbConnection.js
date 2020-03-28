const mongoose = require("mongoose");
const config = require("config");

const connectDB = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://admin:${config.get(
        "dbPassword"
      )}@bookshelf-qmqoj.mongodb.net/test?retryWrites=true&w=majority`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
      }
    );
    console.log("DB Connected");
  } catch (err) {
    if (err) {
      console.log(err.message);
      process.exit(1);
    }
  }
};

module.exports = connectDB;

const mongoose = require("mongoose");

const DEV_MONGO_URI = `mongodb://localhost:27017/spotify`;

const PROD_MONGO_URI = `mongodb+srv://${process.env.MONGO_DB_UN}:${process.env.MONGO_DB_PW}@cluster0.bqu75.mongodb.net/spotify`;

const MONGO_URI =
  process.env.NODE_ENV === "production" ? PROD_MONGO_URI : DEV_MONGO_URI;

exports.dbConnect = () => {
  try {
    mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.clear();
    console.log(
      `Db is connected successfully and server started listening on http://localhost:8000...`
    );
  } catch (_) {
    console.clear();
    console.log(`Some error while connectin to db...`);
  }
};

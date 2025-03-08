const session = require("express-session");
const MongoStore = require("connect-mongo");
require("dotenv").config();

const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET || "supersecretkey",
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    collectionName: "sessions",
  }),
  cookie: {
    httpOnly: true,
    secure: false, // Change to true if using HTTPS
    maxAge: 1000 * 60 * 60 * 24, // 1 day
  },
});

module.exports = sessionMiddleware;

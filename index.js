const express = require("express");
const path = require("path");
const { connectDb } = require("./db");
const cookieParser = require('cookie-parser')
const {restrictToLoggedinUserOnly} = require('./middlewares/auth')

const URL = require("./models/url");

const urlRoute = require("./routes/url");
const staticRoute = require('./routes/staticRoute');
const userRoute = require('./routes/user');

const app = express();
const port = 3000;

connectDb("mongodb://localhost:27017/short-url").then(() => {
  console.log("mongo db connected");
});

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.json());
app.use(express.urlencoded({
    extended:false
}));
app.use(cookieParser());

app.use("/url", restrictToLoggedinUserOnly, urlRoute);
app.use("/user", userRoute);
app.use("/", staticRoute);

app.get("/url/:shortId", async (req, res) => {
  const shortId = req.params.shortId;
  const entry = await URL.findOneAndUpdate(
    {
      shortId,
    },
    {
      $push: {
        visitlog: {
          timestamps: Date.now(),
        },
      },
    }
  );
  res.redirect(entry.redirectUrl);
});

app.listen(port, () => {
  console.log("system start");
});

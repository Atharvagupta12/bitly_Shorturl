const express = require("express");
const urlRoute = require('./routes/url');
const {connectDb} = require('./db');
const URL = require('./models/url');
const app = express();
const port = 3000;

connectDb("mongodb://localhost:27017/short-url")
.then(() => {
    console.log("mongo db connected");
})

app.use(express.json());

app.use("/url", urlRoute);

app.use(express.static("public"));

app.get("/:shortId", async (req, res)=> {
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate({
        shortId 
    }, {
        $push: {
            visitlog:{
                timestamps: Date.now(),
            }
        }
    });
    res.redirect(entry.redirectUrl); 

})

app.listen(port, () => {
    console.log("system start");
})
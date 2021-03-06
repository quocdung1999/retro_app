const express = require("express");
const mongoose = require("mongoose");
const userRouter = require("./routes/userRouter.js");
const boardRouter = require("./routes/boardRouter.js");
const path = require('path');
const cors = require("cors");
require("dotenv").config({
    path: './.env',
});



const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`This server has started on port ${PORT}`));
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex:true,
},
    (err) => {
        if (err) throw err;
        else {
            console.log("MongoDB connection established");
        }
    });

app.use("/api/users",userRouter);
app.use("/api/boards",boardRouter);

if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging') {
    app.use(express.static('client/build'));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'client','build','index.html'));
    });
  }
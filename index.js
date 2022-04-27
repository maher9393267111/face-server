const path = require('path')
const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const { readdirSync } = require("fs");

require("dotenv").config();

// app
const app = express();

// routes

const AuthRoutes = require("./routes/user");




// middlewares
app.use(morgan("dev"));
app.use(bodyParser.json({ limit: "2mb" }));
app.use(cors());




// routes
//app.use('/api',AuthRoutes)



//MONGO DB CONNECTION

mongoose
    .connect(process.env.MONGODB_URL, {
        useNewUrlParser: true,
     
    })
    .then(() => console.log('DB Connected'));



    // routes

    //routes
const hllo= readdirSync("./routes").map((r) => app.use("/api", require("./routes/" + r)));

//console.log(hllo)



   

    //PORT 

const PORT = process.env.PORT || 3000
app.listen(PORT, () =>{
    console.log('Server is running on port', PORT)
})
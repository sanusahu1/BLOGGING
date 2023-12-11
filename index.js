const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const cookieParser = require('cookie-parser');
//---------------------------------------------------------------------//
const userRout = require('./routes/user_router');
const { checkForAuthenticationCookie } = require("./middlewares/authentication");
//---------------------------------------------------------------------//
const app = express();
const PORT = 8004;
//---------------------------------------------------------------------//
mongoose.connect("mongodb://127.0.0.1:27017/BLOGGING?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.0.2")
.then(() => console.log("MongoDB Connected"));
//---------------------------------------------------------------------//
app.set("view engine" , "ejs");
app.set("views",path.resolve("./views"));
//---------------------------------------------------------------------//
app.use(express.urlencoded({extended: false }));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));
app.get('/', (req , res) => {
    res.render("home", {
        user: req.user,
    });
});
app.use("/user", userRout);
//---------------------------------------------------------------------//
app.listen(PORT , () => console.log(`Server Started At PORT ${PORT}`));
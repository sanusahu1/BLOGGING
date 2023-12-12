const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const cookieParser = require('cookie-parser');
//---------------------------------------------------------------------//
const userRout = require('./routes/user_router');
const blogRoute = require("./routes/blog");
const { checkForAuthenticationCookie } = require("./middlewares/authentication");
const Blog = require("./models/blog_model");
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
app.use(express.static(path.resolve("./public/uplodes")));

app.get('/', async (req , res) => {
    const allBlog = await Blog.find({}).sort('createdAt');
    res.render("home", {
        user: req.user,
        blogs: allBlog,
    });
});

app.use("/user", userRout);
app.use(express.static(path.resolve("./public")));
app.use("/blog", blogRoute);
//---------------------------------------------------------------------//
app.listen(PORT , () => console.log(`Server Started At PORT ${PORT}`));
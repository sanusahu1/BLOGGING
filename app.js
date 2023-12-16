const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
dotenv.config();
//---------------------------------------------------------------------//
const userRout = require('./routes/user_router');
const blogRoute = require("./routes/blog");
const { checkForAuthenticationCookie } = require("./middlewares/authentication");
const Blog = require("./models/blog_model");
//---------------------------------------------------------------------//
const app = express();
const defaultPort = 8004; // Set your default port here
//---------------------------------------------------------------------//
mongoose.connect(process.env.MONGODB_URL)
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

app.get("/search", async (req, res) => {
    try {
        const regex = new RegExp(req.query.search, 'i');

        const existingBlogs = await Blog.find({
            titel: { $regex: regex }
        });

        res.render("home", { blogs: existingBlogs });
    } catch (error) {
        console.error("Error finding blog:", error);
        return res.status(500).send("Internal Server Error");
    }
});

app.use("/user", userRout);
app.use(express.static(path.resolve("./public")));
app.use("/blog", blogRoute);
//---------------------------------------------------------------------//
const port = process.env.PORT || defaultPort;
app.listen(port , () => console.log(`Server Started At PORT ${port}`));
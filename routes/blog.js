const { Router } = require("express");
const multer = require("multer");
const router = Router();
const path = require("path");
const Blog = require("../models/blog_model");
const Comment = require("../models/comment");
const Like = require("../models/like");
const mongoose = require('mongoose');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.resolve("./public/uplodes"));
    },
    filename: function (req, file, cb) {
        const fileName = `${Date.now()}-${file.originalname}`;
        cb(null, fileName);
    },
});
const upload = multer({ storage: storage });

router.get('/add-new', (req, res) => {
    return res.render('addBlog', {
        user: req.user,
    });
});

router.post('/', upload.single("coverImage"), async (req, res) => {
    const { titel, body } = req.body;
    const blog = await Blog.create({
        body,
        titel,
        createdBy: req.user._id,
        coverImageURL: `${req.file.filename}`
    });
    return res.redirect(`/blog/${blog._id}`);
});

router.get('/:id', async (req, res) => {
    try {
        const blogId = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(blogId)) {
            return res.status(400).send('Invalid blog ID');
        }
        const blog = await Blog.findById(blogId).populate("createdBy");
        const comments = await Comment.find({ blogId: req.params.id }).populate(
            "createdBy"
        );
        const like = await Like.find({ blogId: req.params.id }).populate(
            "createdBy"
        );
        if (!blog) {
            return res.status(404).send('Blog not found');
        }
        // console.log(like);
        res.render('blog', { 
            blog,
            user: req.user,
            comments,
            like,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

router.post("/comment/:blogId", async (req, res) => {
    await Comment.create({
      content: req.body.content,
      blogId: req.params.blogId,
      createdBy: req.user._id,
    });
    return res.redirect(`/blog/${req.params.blogId}`);
});

router.post("/like/:blogId", async (req, res) => {
    try {
        const existingLike = await Like.findOne({
            blogId: req.params.blogId,
            createdBy: req.user._id,
        });

        if (existingLike) {
            // return res.status(400).send("You have already liked this post.");
            const errorMessage = "You have already liked this post.";
            return res.render("blog", { error: errorMessage });
        }

        await Like.create({
            blogId: req.params.blogId,
            createdBy: req.user._id,
        });

        return res.redirect(`/blog/${req.params.blogId}`);
    } catch (error) {
        console.error("Error adding like:", error);
        return res.status(500).send("Internal Server Error");
    }
});


module.exports = router;
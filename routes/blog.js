const { Router } = require("express");
const multer = require("multer");
const router = Router();
const path = require("path");
const Blog = require("../models/blog_model");

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


module.exports = router;
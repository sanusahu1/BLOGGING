const { Router } = require("express");
const router = Router();
const User = require('../models/user_model');

router.get('/signin' , (req,res) => {
    return res.render("signin");
});

router.get('/signup' , (req,res) => {
    return res.render("signup");
});

router.post('/signup' , async (req,res) => {
    const { name , email , password } =  req.body;
    await User.create({
        name,
        email,
        password,
    });
    return res.redirect("/");
});

router.post('/signin' , async (req,res) => {
    const { email , password } =  req.body;
    const user = User.matchPassword(email , password);

    console.log("User", user);
    return res.redirect("/");
});

module.exports = router;
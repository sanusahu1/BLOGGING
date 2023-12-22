const { Router } = require("express");
const router = Router();
const User = require('../models/user_model');

router.get("/:id", async (req, res) => {
    try {
        const blogId = req.params.id;
        const user = await User.findById(blogId);
        res.render("profile",{
            user,
        });
    } catch (error) {
        return res.render("profile",{
            error: "Internal Server Error",
        });
    }
});

module.exports = router;
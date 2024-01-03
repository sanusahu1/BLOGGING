const { Router } = require("express");
const router = Router();
const User = require('../models/user_model');
const Connection = require('../models/connection_model');
const { ObjectId } = require('mongodb');

router.get("/:id", async (req, res) => {
    try {
        const blogId = req.params.id;
        const user = await User.findById(blogId);

        if (!user) {
            console.log("User Not Found ");
            return res.json({ error: "User Not Found" });
        }

        const userObjectId = new ObjectId(user._id.toString());
        const connections = await Connection.find({ $or: [{ flwId: userObjectId }, { flngId: userObjectId }] });

        const followersCount = connections.filter(connection => connection.flngId.equals(userObjectId)).length;
        const followingCount = connections.filter(connection => connection.flwId.equals(userObjectId)).length;

        res.render("profile", {
            user,
            followersCount,
            followingCount,
        });
    } catch (error) {
        console.error("Internal Server Error:", error);
        return res.render("profile", {
            error: "Internal Server Error",
        });
    }
});


module.exports = router;
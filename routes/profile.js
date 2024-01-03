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

// router.get("/network/:id", async (req, res) => {
//     try {
//         const blogId = req.params.id;
//         const user = await User.findById(blogId);

//         if (!user) {
//             console.log("User Not Found ");
//             return res.json({ error: "User Not Found" });
//         }

//         const userObjectId = new ObjectId(user._id.toString());
//         const connections = await Connection.find({ $or: [{ flwId: userObjectId }, { flngId: userObjectId }] });

//         res.render("network", {
//             user,
//             connections,
//         });
//     } catch (error) {
//         console.error("Internal Server Error:", error);
//         return res.render("network", {
//             error: "Internal Server Error",
//         });
//     }
// });

router.get("/network/:id", async (req, res) => {
    try {
        const blogId = req.params.id;
        const user = await User.findById(blogId);

        if (!user) {
            console.log("User Not Found ");
            return res.json({ error: "User Not Found" });
        }

        const userObjectId = new ObjectId(user._id.toString());
        const connections = await Connection.find({ $or: [{ flwId: userObjectId }, { flngId: userObjectId }] })
            .populate('flwId', 'name profilePicUrl') // Populate follower details (name and profilePicUrl)
            .populate('flngId', 'name profilePicUrl'); // Populate following details (name and profilePicUrl)

        // Separate the connections into followers and following arrays
        const followers = connections.filter(connection => connection.flngId.equals(userObjectId));
        const following = connections.filter(connection => connection.flwId.equals(userObjectId));

        res.render("network", {
            user,
            followers,
            following,
        });
    } catch (error) {
        console.error("Internal Server Error:", error);
        return res.render("network", {
            error: "Internal Server Error",
        });
    }
});


module.exports = router;
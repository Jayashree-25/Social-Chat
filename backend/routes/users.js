import express from "express";
import User from "../models/User.js";
import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();

router.put("/:id/follow", verifyToken, async (req, res) => {
    // req.user.id is the ID of the currently logged-in user (the one doing the following)
    // req.params.id is the ID of the user they want to follow
    if (req.user.id !== req.params.id) {
        try {
            const userToFollow = await User.findById(req.params.id);
            const currentUser = await User.findById(req.user.id);

            if (!userToFollow) {
                return res.status(404).json({ message: "User to follow not found" });
            }

            // Check if the current user is already following the other user
            if (!userToFollow.followers.includes(req.user.id)) {
                // If not, follow them
                await userToFollow.updateOne({ $push: { followers: req.user.id } });
                await currentUser.updateOne({ $push: { following: req.params.id } });
                res.status(200).json({ message: "User has been followed" });
            } else {
                // If they are, unfollow them
                await userToFollow.updateOne({ $pull: { followers: req.user.id } });
                await currentUser.updateOne({ $pull: { following: req.params.id } });
                res.status(200).json({ message: "User has been unfollowed" });
            }
        } catch (err) {
            res.status(500).json({ message: "Server error", error: err.message });
        }
    } else {
        res.status(403).json({ message: "You can't follow yourself" });
    }
});

export default router;

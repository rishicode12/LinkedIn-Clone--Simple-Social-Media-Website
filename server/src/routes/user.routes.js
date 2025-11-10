import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { User } from "../models/User.js";
import { Post } from "../models/Post.js";

const router = Router();

// My profile (basic)
router.get("/me", requireAuth, async (req, res) => {
  const me = await User.findById(req.user._id).select("-passwordHash");
  res.json(me);
});

// Update my profile
router.put("/me", requireAuth, async (req, res) => {
  try {
    const { name, headline, location, about } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { name, headline, location, about },
      { new: true, runValidators: true }
    ).select("-passwordHash");
    
    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    
    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update profile image
router.put("/me/avatar", requireAuth, async (req, res) => {
  try {
    const { avatarUrl } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { avatarUrl },
      { new: true, runValidators: true }
    ).select("-passwordHash");
    
    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    
    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update cover image
router.put("/me/cover", requireAuth, async (req, res) => {
  try {
    const { coverUrl } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { coverUrl },
      { new: true, runValidators: true }
    ).select("-passwordHash");
    
    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    
    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// By id
router.get("/:id", requireAuth, async (req, res) => {
  const user = await User.findById(req.params.id).select("-passwordHash");
  res.json(user);
});

// My posts shortcut
router.get("/me/posts", requireAuth, async (req, res) => {
  const posts = await Post.find({ author: req.user._id })
    .populate("author", "name avatarUrl")
    .sort({ createdAt: -1 });
  res.json(posts);
});

export default router;
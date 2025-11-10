import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { Post } from "../models/Post.js";

const router = Router();

function serializePost(post, viewerId) {
  if (!post) return null;
  const likes = post.likes || [];
  const comments = post.comments || [];
  return {
    id: post._id,
    text: post.text,
    imageUrl: post.imageUrl,
    createdAt: post.createdAt,
    author: post.author
      ? {
          id: post.author._id,
          name: post.author.name,
          avatarUrl: post.author.avatarUrl,
        }
      : undefined,
    likesCount: likes.length,
    liked: viewerId
      ? likes.some((id) => id.toString() === viewerId.toString())
      : false,
    commentsCount: comments.length,
  };
}

function serializeComment(comment) {
  if (!comment) return null;
  return {
    id: comment._id,
    text: comment.text,
    createdAt: comment.createdAt,
    user: comment.user
      ? {
          id: comment.user._id,
          name: comment.user.name,
          avatarUrl: comment.user.avatarUrl,
        }
      : undefined,
  };
}

// Create a post
router.post("/", requireAuth, async (req, res) => {
  const { text, imageUrl } = req.body;
  const post = await Post.create({
    author: req.user._id,
    text,
    imageUrl,
  });
  await post.populate("author", "name avatarUrl");
  res.status(201).json(serializePost(post, req.user._id));
});

// Feed - latest posts
router.get("/feed", requireAuth, async (req, res) => {
  const posts = await Post.find({})
    .populate("author", "name avatarUrl")
    .sort({ createdAt: -1 })
    .limit(50);
  res.json(posts.map((post) => serializePost(post, req.user._id)));
});

// Posts by user
router.get("/by/:userId", requireAuth, async (req, res) => {
  const { userId } = req.params;
  const posts = await Post.find({ author: userId })
    .populate("author", "name avatarUrl")
    .sort({ createdAt: -1 });
  res.json(posts.map((post) => serializePost(post, req.user._id)));
});

// Like / Unlike
router.post("/:id/like", requireAuth, async (req, res) => {
  const { id } = req.params;
  const post = await Post.findByIdAndUpdate(
    id,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  ).populate("author", "name avatarUrl");
  if (!post) return res.status(404).json({ error: "Post not found" });
  res.json(serializePost(post, req.user._id));
});

router.post("/:id/unlike", requireAuth, async (req, res) => {
  const { id } = req.params;
  const post = await Post.findByIdAndUpdate(
    id,
    { $pull: { likes: req.user._id } },
    { new: true }
  ).populate("author", "name avatarUrl");
  if (!post) return res.status(404).json({ error: "Post not found" });
  res.json(serializePost(post, req.user._id));
});

// Comment
router.post("/:id/comments", requireAuth, async (req, res) => {
  const { id } = req.params;
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: "Comment text required" });
  const post = await Post.findById(id).populate("comments.user", "name avatarUrl");
  if (!post) return res.status(404).json({ error: "Post not found" });
  post.comments.push({ user: req.user._id, text });
  await post.save();
  await post.populate("comments.user", "name avatarUrl");
  const newComment = post.comments[post.comments.length - 1];
  res
    .status(201)
    .json({
      comment: serializeComment(newComment),
      commentsCount: post.comments.length,
    });
});

// List comments
router.get("/:id/comments", requireAuth, async (req, res) => {
  const { id } = req.params;
  const post = await Post.findById(id).populate("comments.user", "name avatarUrl");
  if (!post) return res.json([]);
  res.json(post.comments.map((comment) => serializeComment(comment)));
});

export default router;


import { Router } from "express";
import bcrypt from "bcryptjs";
import { User } from "../models/User.js";
import { signAuthToken } from "../middleware/auth.js";
import { OAuth2Client } from "google-auth-library";

const router = Router();
const googleClient = process.env.GOOGLE_CLIENT_ID
  ? new OAuth2Client(process.env.GOOGLE_CLIENT_ID)
  : null;

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: "Missing fields" });
  }
  const existing = await User.findOne({ email });
  if (existing) return res.status(409).json({ error: "Email already in use" });
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, passwordHash });
  const token = signAuthToken(user._id.toString());
  res.status(201).json({
    user: { id: user._id, name: user.name, email: user.email, avatarUrl: user.avatarUrl },
    token,
  });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ error: "Invalid credentials" });
  const ok = await user.comparePassword(password);
  if (!ok) return res.status(401).json({ error: "Invalid credentials" });
  const token = signAuthToken(user._id.toString());
  res.json({
    user: { id: user._id, name: user.name, email: user.email, avatarUrl: user.avatarUrl },
    token,
  });
});

// Google OAuth via ID token
router.post("/google", async (req, res) => {
  try {
    if (!googleClient) return res.status(500).json({ error: "Google not configured" });
    const { idToken } = req.body;
    if (!idToken) return res.status(400).json({ error: "idToken required" });
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const email = payload.email;
    const name = payload.name || email.split("@")[0];
    const avatarUrl = payload.picture;

    let user = await User.findOne({ email });
    if (!user) {
      // Create user with a random hash placeholder (not used for Google logins)
      user = await User.create({
        name,
        email,
        passwordHash: await (await import("bcryptjs")).default.hash(
          Math.random().toString(36),
          10
        ),
        avatarUrl,
      });
    }
    const token = signAuthToken(user._id.toString());
    res.json({
      user: { id: user._id, name: user.name, email: user.email, avatarUrl: user.avatarUrl },
      token,
    });
  } catch (e) {
    res.status(401).json({ error: "Google authentication failed" });
  }
});

export default router;




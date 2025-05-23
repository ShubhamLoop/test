import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { Post } from "./models/post.js";
import { User } from "./models/user.js";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
dotenv.config();
const app = express();
const port = 3000;

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("helo");
});

app.post("/post", async (req, res) => {
  const { content, user } = req.body;
  const post = await Post.create({ content: content, user: user });
  return res.status(201).json(post);
});

app.get("/get", async (req, res) => {
  const comments = await Post.find({});
  return res.status(200).json(comments);
});

app.put("/updatePost/:id", async (req, res) => {
  const { id } = req.params;
  const { NewContent, NewUser } = req.body;
  const updated = await Post.findByIdAndUpdate(
    id,
    {
      $set: { content: NewContent, user: NewUser },
    },
    { new: true }
  );

  return res.status(202).json({ updated }, "updated");
});

app.delete("/deletePost/:id", async (req, res) => {
  const { id } = req.params;
  console.log("id =======================================", id);

  const deleted = await Post.findByIdAndDelete({ _id: id });

  return res.status(204).json({ message: "deleted", deleted });
});

app.post("/register", async (req, res) => {
  const { name, password, pic } = req.body;

  const UserExist = await User.findOne({ name });

  if (UserExist) {
    res.send("User exits with the name");
  }
  const salt = 10;
  const hashed = await bcrypt.hash(password.toString(), salt);
  console.log("hashed", hashed);

  const created = await User.create({
    name,
    password: hashed,
    pic: pic || null,
  });

  const user = await User.findById(created._id).select("-password");
  return res.status(201).json({ message: "User Created", user });
});

app.post("/login", async (req, res) => {
  try {
    const { name, password } = req.body;

    const user = await User.findOne({ name });

    const isPassRight = await bcrypt.compare(
      password.toString(),
      user.password
    );

    if (!isPassRight) {
      res.send("passwrod not match");
    }

    const token = jwt.sign(
      { id: user._id, name: user.name },
      process.env.JWT_SECRET
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
    });

    return res.status(202).json({ message: "Logged in" });
  } catch (error) {
    res.send(error);
  }
});

app.post("/logout", async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out" });
});

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("db connected");
  })
  .catch((err) => {
    console.log(err.message);
  });

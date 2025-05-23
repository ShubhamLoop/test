import mongoose from "mongoose";

const PostSchema = mongoose.Schema({
  content: {
    type: String,
    require: true,
  },
  user: {
    type: String,
  },
});

export const Post = mongoose.model("Post", PostSchema);

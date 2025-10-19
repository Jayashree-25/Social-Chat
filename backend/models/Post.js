import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  likes: [{ type: String, lowercase: true }],
  comments: [
    {
      user: { type: String, required: true },
      text: { type: String, required: true },
      createdAt: { type: Date, default: Date.now },
    },
  ],
  username: { type: String, default: null },
  text: { type: String },
  images: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
});

const Post = mongoose.model("Post", postSchema);
export default Post;
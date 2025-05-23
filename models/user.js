import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  name: {
    type: String,
    require: true,
    unique: true,
  },
  password: {
    type: String,
    require: true,
  },
  pic: {
    type: String,
  },
});

export const User = mongoose.model("User", userSchema);

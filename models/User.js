import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  firstName: { type: String, required: true, default: "" },
  lastName: { type: String, default: "" },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
});

export default mongoose.models.User || mongoose.model("User", UserSchema);

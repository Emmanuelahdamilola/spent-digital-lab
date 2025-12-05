import mongoose from "mongoose";

const deviceTokenSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  token: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model("DeviceToken", deviceTokenSchema);

import mongoose from "mongoose";

const AuthenticationSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    user_access: { type: String, required: true },
    password: { type: String, required: true },
  },
  { timestamps: true } // Enable timestamps
);

// Convert MongoDB `_id` to `id` and remove unnecessary fields
AuthenticationSchema.set("toJSON", {
  transform: (_, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

const Authentication = mongoose.model("Authentication", AuthenticationSchema);
export default Authentication;

import mongoose from "mongoose";

const ItemSchema = new mongoose.Schema({
  name: String,
});

// Ensure every document is converted to a plain JSON object automatically
ItemSchema.set("toJSON", {
  transform: (_, ret) => {
    ret.id = ret._id.toString(); // Ensure `_id` is a string
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

const Item = mongoose.model("Item", ItemSchema);
export default Item;

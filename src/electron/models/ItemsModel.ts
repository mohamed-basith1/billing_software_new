import mongoose from "mongoose";
const ItemSchema = new mongoose.Schema(
  {
    item_name: { type: String, required: true, unique: true },
    code: { type: String, required: true, unique: true },
    uom: { type: String, required: true },
    qty: { type: Number, required: true },
    purchased_rate: { type: Number, required: true },
    rate: { type: Number, required: true },
    amount: { type: Number, required: true },
    stock_qty: { type: Number, required: true },
    margin: { type: Number },
    low_stock_remainder: { type: Number },
    item_expiry_date: { type: String },
    new_stock: { type: Array, default: [] },
  },
  { timestamps: true } // Enable timestamps
);
// Convert MongoDB `_id` to `id` and remove unnecessary fields
ItemSchema.set("toJSON", {
  transform: (_, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});
const ItemModel = mongoose.model("Item", ItemSchema);
export default ItemModel;

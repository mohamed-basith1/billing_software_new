import mongoose from "mongoose";

const getISTDate = () => {
  const date = new Date();
  const offset = 5.5 * 60 * 60 * 1000; // IST is UTC + 5:30
  return new Date(date.getTime() + offset); // Adjust the date for IST
};
const ItemSchema = new mongoose.Schema(
  {
    item_name: { type: String, required: true, unique: true },
    code: { type: String, required: true },
    uom: { type: String, required: true },
    qty: { type: Number, required: true },
    purchased_rate: { type: Number, required: true },
    rate: { type: Number, required: true },
    amount: { type: Number, required: true },
    stock_qty: { type: Number, required: true },
    unique_id: { type: String, required: true },
    margin: { type: Number },
    low_stock_remainder: { type: Number },
    item_expiry_date: { type: String },
    new_stock: { type: Array, default: [] },
    createdAt: { type: Date, default: getISTDate },
    updatedAt: { type: Date, default: getISTDate },
  },
  { timestamps: false } // Enable timestamps
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

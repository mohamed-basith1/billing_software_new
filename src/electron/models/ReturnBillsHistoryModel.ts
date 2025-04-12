import mongoose from "mongoose";

const getISTDate = () => {
  const date = new Date();
  const offset = 5.5 * 60 * 60 * 1000; // IST is UTC + 5:30
  return new Date(date.getTime() + offset); // Adjust the date for IST
};
const ReturnBillsHistorySchema = new mongoose.Schema(
  {
    bill_number: { type: String,unique: false},
    returned_items: [],
    previous_bill_amount: { type: Number, required: true },
    returned_amount: { type: Number, required: true },
    returned_by: { type: String, required: true },
    createdAt: { type: Date, default: getISTDate },
    updatedAt: { type: Date, default: getISTDate },
  },
  { timestamps: false } // Enable timestamps
);

// Convert MongoDB `_id` to `id` and remove unnecessary fields
ReturnBillsHistorySchema.set("toJSON", {
  transform: (_, ret) => {
    ret.id = ret._id?.toString();
    ret.itemsList = ret.itemsList.map((item) => ({
      ...item.toObject(),
      id: item._id.toString(), // Convert `_id` to `id` for each item
    }));
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

const ReturnBillsHistoryModel = mongoose.model(
  "ReturnBillHistorie",
  ReturnBillsHistorySchema
);
export default ReturnBillsHistoryModel;

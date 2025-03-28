import mongoose from "mongoose";

const ReturnBillsHistorySchema = new mongoose.Schema(
  {
    bill_number: { type: String,unique: false},
    returned_items: [],
    previous_bill_amount: { type: Number, required: true },
    returned_amount: { type: Number, required: true },
    returned_by: { type: String, required: true },
  },
  { timestamps: true }
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

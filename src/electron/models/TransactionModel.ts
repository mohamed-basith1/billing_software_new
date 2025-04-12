import mongoose from "mongoose";

const getISTDate = () => {
  const date = new Date();
  const offset = 5.5 * 60 * 60 * 1000; // IST is UTC + 5:30
  return new Date(date.getTime() + offset); // Adjust the date for IST
};
const TransactionSchema = new mongoose.Schema(
  {
    status: { type: String },
    bill_no: { type: String },
    customer: { type: String },
    employee: { type: String },
    method: { type: String },
    reason: { type: String },
    amount: { type: Number },
    handler: { type: String },
    createdAt: { type: Date, default: getISTDate },
    updatedAt: { type: Date, default: getISTDate },
  },
  { timestamps: false } // Enable timestamps
);
// Convert MongoDB `_id` to `id` and remove unnecessary fields
TransactionSchema.set("toJSON", {
  transform: (_, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});
const TransactionModel = mongoose.model("Transaction", TransactionSchema);
export default TransactionModel;

import mongoose from "mongoose";


const getISTDate = () => {
  const date = new Date();
  const offset = 5.5 * 60 * 60 * 1000; // IST is UTC + 5:30
  return new Date(date.getTime() + offset); // Adjust the date for IST
};


const ItemSchema = new mongoose.Schema({
  item_name: { type: String, required: true },
  code: { type: String, required: true },
  unique_id: { type: String, required: true },
  uom: { type: String, required: true }, // Unit of Measurement
  qty: { type: Number, required: true },
  purchased_rate: { type: Number, required: true },
  rate: { type: Number, required: true },
  amount: { type: Number, required: true },
  createdAt: { type: String, required: true },
});

const BillSchema = new mongoose.Schema(
  {
    bill_number: { type: String, unique: true },
    customer_name: { type: String },
    customer_id: { type: String },
    itemsList: [ItemSchema], // Embedding `ItemSchema`
    discount: { type: Number, required: true, default: 0 },
    sub_amount: { type: Number, required: true },
    total_amount: { type: Number, required: true },
    paid: { type: Boolean, required: true, default: false },
    amount_paid: { type: Number, required: true },
    return_amount: { type: Number, required: true ,default: 0},
    payment_method: { type: String, required: true },
    balance: { type: Number, required: true },
    billed_by: { type: String, required: true },

    createdAt: { type: Date, default: getISTDate },
    updatedAt: { type: Date, default: getISTDate },
  },
  { timestamps: false } // Enable timestamps
);

// Convert MongoDB `_id` to `id` and remove unnecessary fields
BillSchema.set("toJSON", {
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

const BillsModel = mongoose.model("Bill", BillSchema);
export default BillsModel;

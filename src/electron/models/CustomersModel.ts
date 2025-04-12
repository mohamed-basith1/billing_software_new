import mongoose from "mongoose";

const getISTDate = () => {
    const date = new Date();
    const offset = 5.5 * 60 * 60 * 1000; // IST is UTC + 5:30
    return new Date(date.getTime() + offset); // Adjust the date for IST
  };
const CustomerSchema = new mongoose.Schema({
    customerName: { type: String, required: true, unique: true },
    customerAddress: { type: String },
    customerArea: { type: String },
    customerPincode: { type: String }, // Not mandatory
    customerState: { type: String },
    customerPrimaryContact: { type: String }, // Not mandatory
    customerSecondaryContact: { type: String }, // Not mandatory
    customerEmail: { type: String },
    createdAt: { type: Date, default: getISTDate },
    updatedAt: { type: Date, default: getISTDate },
  },
  { timestamps: false } // Enable timestamps
);
// Convert MongoDB `_id` to `id` and remove unnecessary fields
CustomerSchema.set("toJSON", {
    transform: (_, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
    },
});
const CustomersModel = mongoose.model("Customer", CustomerSchema);
export default CustomersModel;

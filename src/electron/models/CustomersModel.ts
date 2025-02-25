import mongoose from "mongoose";
const CustomerSchema = new mongoose.Schema({
    customerName: { type: String, required: true, unique: true },
    customerAddress: { type: String },
    customerArea: { type: String },
    customerPincode: { type: String }, // Not mandatory
    customerState: { type: String },
    customerPrimaryContact: { type: String }, // Not mandatory
    customerSecondaryContact: { type: String }, // Not mandatory
    customerEmail: { type: String },
}, { timestamps: true } // Enables createdAt & updatedAt fields
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

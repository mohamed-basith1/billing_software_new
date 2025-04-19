import mongoose from "mongoose";

const getISTDate = () => {
  const date = new Date();
  const offset = 5.5 * 60 * 60 * 1000; // IST is UTC + 5:30
  return new Date(date.getTime() + offset);
};

const HistorySchema = new mongoose.Schema({
  amount: { type: Number },
  paymentMethod: { type: String },
  createdAt: { type: Date, default: getISTDate },
});

const DealerBillSchema = new mongoose.Schema(
  {
    purchasedItemList: { type: Array, required: true },
    dealerName: { type: String, required: true },
    dealerPurchasedPrice: { type: Number, required: true },
    givenAmount: { type: Number, default: 0 },
    history: { type: [HistorySchema], default: [] },
    createdAt: { type: Date, default: getISTDate },
    updatedAt: { type: Date, default: getISTDate },
  },
  { timestamps: false }
);

const DealerBillHistoryModel = mongoose.model(
  "DealerBillHistories",
  DealerBillSchema
);
export default DealerBillHistoryModel;

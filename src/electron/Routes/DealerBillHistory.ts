import { ipcMain } from "electron";
import TestDealerBillHistoryModel from "../models/TestDealerBillHistoryModel.js"; // make sure path is correct
import Item from "../models/ItemsModel.js";
export function DealerBillRouter() {
  ipcMain.handle("get-dealer-bill-summary", async () => {
    try {
      const DealerBillList = await TestDealerBillHistoryModel.find().lean(); // Use lean() for better performance
      // Calculate totals
      const totals = DealerBillList.reduce(
        (acc, bill) => {
          acc.total_purchased_amount += bill.dealerPurchasedPrice || 0;
          acc.total_given_amount += bill.givenAmount || 0;
          return acc;
        },
        {
          total_purchased_amount: 0,
          total_given_amount: 0,
        }
      );
      const balance_amount =
        totals.total_purchased_amount - totals.total_given_amount;
      let final = {
        ...totals,
        balance_amount,
      };
      return {
        status: 200,
        data: JSON.parse(JSON.stringify(final)),
      };
    } catch (error: any) {
      console.error("Error creating dealer bill:", error);
      return {
        status: 500,
        message: "Internal server error while creating dealer bill.",
        error: error.message,
      };
    }
  });

  //get Dealer Bill
  ipcMain.handle("get-dealer-bill", async () => {
    try {
     
      const DealerBillList = await TestDealerBillHistoryModel.find().lean(); // Use lean() for better performance
      return {
        status: 200,
        data: JSON.parse(JSON.stringify(DealerBillList)),
      };
    } catch (error: any) {
      console.error("Error creating dealer bill:", error);
      return {
        status: 500,
        message: "Internal server error while creating dealer bill.",
        error: error.message,
      };
    }
  });

  // Create Dealer Bill
  ipcMain.handle("create-dealer-bill", async (_, data) => {
    try {
    
      const newDealerBill = await TestDealerBillHistoryModel.create(data);
      return {
        status: 201,
        message: "Dealer bill created successfully.",
        data: newDealerBill.toObject ? newDealerBill.toObject() : newDealerBill,
      };
    } catch (error: any) {
      console.error("Error creating dealer bill:", error);
      return {
        status: 500,
        message: "Internal server error while creating dealer bill.",
        error: error.message,
      };
    }
  });

  // add dealer bill pay history
  ipcMain.handle("add-dealer-bill-history", async (_, data) => {
    try {
      const { id, amount, paymentMethod } = data;
      // Step 1: Find the existing document
      const existingDealerBill = await TestDealerBillHistoryModel.findById(id);

      if (!existingDealerBill) {
        return {
          status: 404,
          message: "Dealer bill not found.",
        };
      }

      // Step 2: Calculate new givenAmount
      const updatedGivenAmount =
        Number(existingDealerBill.givenAmount || 0) + Number(amount);

      const updatedDealerBill = await TestDealerBillHistoryModel.findByIdAndUpdate(
        id,
        {
          $push: {
            history: {
              amount: Number(amount),
              paymentMethod,
            },
          },
          $set: {
            givenAmount: updatedGivenAmount,
          },
        },
        { new: true }
      );

      if (!updatedDealerBill) {
        return {
          status: 404,
          message: "Dealer bill not found.",
        };
      }

      return {
        status: 200,
        message: "Dealer payment history added successfully.",
        data: JSON.parse(JSON.stringify(updatedDealerBill)),
      };
    } catch (error: any) {
      console.error("Error updating dealer bill history:", error);
      return {
        status: 500,
        message: "Internal server error while updating dealer bill history.",
        error: error.message,
      };
    }
  });

  ipcMain.handle("delete-dealer-bill-history", async (_, data) => {
    try {
      // Step 1: Reduce stock for each item in the purchased list
      for (const purchasedItem of data.purchasedItemList) {
        await Item.updateOne(
          { unique_id: purchasedItem.unique_id }, // you can also use another identifier like unique or id
          { $inc: { stock_qty: -purchasedItem.stock_qty } }
        );
      }
      const deletedDealerBill = await TestDealerBillHistoryModel.findByIdAndDelete(
        data._id
      );

     

      if (!deletedDealerBill) {
        return {
          status: 404,
          message: "Dealer bill not found.",
        };
      }
      return {
        status: 200,
        message: "Dealer bill deleted successfully.",
        data: JSON.parse(JSON.stringify(deletedDealerBill)),
      };
    } catch (error: any) {
      console.error("Error deleting dealer bill:", error);
      return {
        status: 500,
        message: "Internal server error while deleting dealer bill.",
        error: error.message,
      };
    }
  });
}

ipcMain.handle("delete-dealer-payment-history", async (_, data) => {
  try {
   
    const { _id, amount } = data;

    if (!_id || typeof amount !== "number") {
      return {
        status: 400,
        message: "Invalid payload. '_id' and 'amount' are required.",
      };
    }

    // Step 1: Find the parent dealer bill
    const dealerBill = await TestDealerBillHistoryModel.findOne({
      "history._id": _id,
    });

    if (!dealerBill) {
      return {
        status: 404,
        message: "Dealer bill with the given history ID not found.",
      };
    }

    // Step 2: Remove the history entry and reduce the givenAmount
    const updatedDealerBill = await TestDealerBillHistoryModel.findOneAndUpdate(
      { _id: dealerBill._id },
      {
        $pull: { history: { _id } },
        $inc: { givenAmount: -amount },
      },
      { new: true }
    );

    if (!updatedDealerBill) {
      return {
        status: 500,
        message: "Failed to update dealer bill.",
      };
    }

    return {
      status: 200,
      data: JSON.parse(JSON.stringify(updatedDealerBill)),
      message: "Dealer bill history entry deleted and givenAmount updated.",
    };
  } catch (error: any) {
    console.error("Error deleting dealer payment history:", error);
    return {
      status: 500,
      message: "Internal server error while deleting history entry.",
      error: error.message,
    };
  }
});

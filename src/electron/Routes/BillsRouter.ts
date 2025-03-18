import { ipcMain } from "electron";
import BillsModel from "../models/BillsModel.js";
import Item from "../models/ItemsModel.js";
export function BillsRouter() {
  // Create Bill
  ipcMain.handle("create-bill", async (_, data) => {
    try {
      const {
        customer_name,
        customer_id,
        itemsList,
        discount,
        sub_amount,
        total_amount,
        paid,
        amount_paid,
        payment_method,
        balance,
        billed_by,
      } = data;

      console.log("createBill", data);

      // Count existing bills to determine the next bill number
      const billCount = await BillsModel.countDocuments();
      const bill_number = `BILL-${billCount + 1}`; // Generates a sequential bill number (e.g., BILL-1, BILL-2)

      // Reduce stock_qty for each item in the billing list
      for (const item of itemsList) {
        const existingItem = await Item.findOne({ code: item.code });

        if (!existingItem) {
          console.error(`Item with code ${item.code} not found`);
          return {
            status: 400,
            message: `Item with code ${item.code} not found.`,
          };
        }

        // Reduce the stock_qty by the billed qty
        existingItem.stock_qty -= item.qty;

        if (existingItem.stock_qty < 0) {
          console.warn(
            `Item ${item.item_name} stock is negative after billing.`
          );
          existingItem.stock_qty = 0; // Ensure stock doesn't go negative
        }

        await existingItem.save();
      }

      // Create new bill
      const newBill = await BillsModel.create({
        bill_number,
        customer_name,
        customer_id,
        itemsList,
        discount,
        sub_amount,
        total_amount,
        paid,
        amount_paid,
        payment_method,
        balance,
        billed_by,
      });

      console.log("Billing ItemsList", itemsList);

      return {
        status: 201,
        message: "Bill created successfully, and stock updated.",
        data: newBill.toObject ? newBill.toObject() : newBill,
      };
    } catch (error: any) {
      console.error("Error creating bill:", error);
      return {
        status: 500,
        message: "Internal server error.",
        error: error.message,
      };
    }
  });

  ipcMain.handle(
    "get-bills",
    async (_event, { fromDate, toDate, payment_method }) => {
      try {
        console.log("getting trigger", fromDate, toDate, payment_method);

        // Construct the query object dynamically
        const query: any = {
          createdAt: {
            $gte: new Date(fromDate),
            $lte: new Date(toDate),
          },
        };

        // Add payment_method filter only if it's provided
        if (payment_method) {
          query.payment_method = payment_method;
        }

        const bills = await BillsModel.find(query).lean(); // Use lean() for better performance
        // Convert `_id` to string before sending the response
        const serializedBills = bills.map((bill) => ({
          ...bill,
          _id: bill._id.toString(),
        }));

        return {
          status: 200,
          data: serializedBills,
        };
      } catch (error: any) {
        console.error("Error fetching bills:", error);
        return {
          status: 500,
          message: "Internal server error.",
          error: error.message,
        };
      }
    }
  );

  // Get Single Bill by ID
  ipcMain.handle("get-bill", async (_, billId) => {
    try {
      const bill = await BillsModel.findById(billId);
      if (!bill) {
        return {
          status: 404,
          message: "Bill not found.",
        };
      }
      return {
        status: 200,
        data: bill,
      };
    } catch (error: any) {
      console.error("Error fetching bill:", error);
      return {
        status: 500,
        message: "Internal server error.",
        error: error.message,
      };
    }
  });

  // Update Bill
  ipcMain.handle("update-bill", async (_, { id, updatedData }) => {
    try {
      const bill = await BillsModel.findByIdAndUpdate(id, updatedData, {
        new: true,
      });
      if (!bill) {
        return {
          status: 404,
          message: "Bill not found.",
        };
      }
      return {
        status: 200,
        message: "Bill updated successfully.",
        data: JSON.parse(JSON.stringify(bill)),
      };
    } catch (error: any) {
      console.error("Error updating bill:", error);
      return {
        status: 500,
        message: "Internal server error.",
        error: error.message,
      };
    }
  });

  // Delete Bill
  ipcMain.handle("delete-bill", async (_, billId) => {
    try {
      const bill = await BillsModel.findByIdAndDelete(billId);
      if (!bill) {
        return {
          status: 404,
          message: "Bill not found.",
        };
      }
      return {
        status: 200,
        message: "Bill deleted successfully.",
      };
    } catch (error: any) {
      console.error("Error deleting bill:", error);
      return {
        status: 500,
        message: "Internal server error.",
        error: error.message,
      };
    }
  });
}

import { ipcMain } from "electron";
import BillsModel from "../models/BillsModel.js";

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

      return {
        status: 201,
        message: "Bill created successfully.",
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

  // Get All Bills
  ipcMain.handle("get-bills", async () => {
    try {
      const bills = await BillsModel.find();
      return {
        status: 200,
        data: JSON.parse(JSON.stringify(bills)),
      };
    } catch (error: any) {
      console.error("Error fetching bills:", error);
      return {
        status: 500,
        message: "Internal server error.",
        error: error.message,
      };
    }
  });

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

import { ipcMain } from "electron";
import BillsModel from "../models/BillsModel.js";
import ReturnBillsHistoryModel from "../models/ReturnBillsHistoryModel.js";
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
        const existingItem = await Item.findOne({ unique_id: item.unique_id });

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
            $gte: new Date(fromDate).setUTCHours(0, 0, 0, 0),
            $lte: new Date(toDate).setUTCHours(23, 59, 59, 999),
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
          // _id: bill._id.toString(),
        }));

        return {
          status: 200,
          data: JSON.parse(JSON.stringify(serializedBills)),
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

  ipcMain.handle(
    "return-bill",
    async (_, { id, updatedData, tempRemoveItem }) => {
      console.log("tempRemoveItem =>", tempRemoveItem);
      try {
        // Update the bill
        const bill = await BillsModel.findOneAndReplace(
          { _id: id },
          updatedData,
          {
            new: true, // Ensure we return the updated document
            upsert: false, // Do not create a new one if missing
          }
        ).lean(); // Convert to plain JavaScript object

        if (!bill) {
          return {
            status: 404,
            message: "Bill not found.",
          };
        }

        // Process tempRemoveItem to update stock_qty
        for (const tempItem of tempRemoveItem) {
          const { code, qty } = tempItem;

          // Find the item in the database by code
          const item = await Item.findOne({ code });

          if (item) {
            // Update stock_qty by adding the qty from tempRemoveItem
            item.stock_qty += qty;
            await item.save();
          }
        }

        return {
          status: 200,
          message: "Bill updated successfully, and stock quantities adjusted.",
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
    }
  );

  ipcMain.handle(
    "get-bill-by-search",
    async (_, { bill_number, payment_method }) => {
      console.log("");
      try {
        if (!bill_number || !payment_method) {
          return {
            status: 400,
            data: [],
            message: "Bill number and payment method are required",
          };
        }

        const bills = await BillsModel.find({
          bill_number: { $regex: bill_number, $options: "i" },
          payment_method: payment_method, // Ensures the payment method matches
        })
          .limit(13) // Return only 13 matches
          .lean(); // Convert Mongoose documents to plain objects

        return {
          status: 200,
          data: JSON.parse(JSON.stringify(bills)),
        };
      } catch (error: any) {
        console.error("Error fetching bill:", error);
        return {
          status: 500,
          message: "Internal server error.",
          error: error.message,
        };
      }
    }
  );

  ipcMain.handle(
    "return-pending-amount",
    async (_, { id, returnPendingAmount }) => {
      try {
        // Prepare updated data with return_amount set to 0 and amount_paid set to returnPendingAmount
        const updatedData = {
          return_amount: 0,
          amount_paid: returnPendingAmount,
        };

        // Update the bill using findOneAndUpdate, ensuring other fields remain unchanged
        const bill = await BillsModel.findOneAndUpdate(
          { _id: id },
          { $set: updatedData }, // Update only the fields you want
          {
            new: true, // Ensure we return the updated document
            upsert: false, // Do not create a new one if missing
          }
        ).lean(); // Convert to plain JavaScript object

        if (!bill) {
          return {
            status: 404,
            message: "Bill not found.",
          };
        }

        return {
          status: 200,
          message: "Bill updated successfully, and stock quantities adjusted.",
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
    }
  );

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

  ipcMain.handle(
    "update-bill-payment-method",
    async (_, { id, payment_method }) => {
      try {
        console.log("id and payment method", id, payment_method);
        const bill = await BillsModel.findByIdAndUpdate(
          id,
          { payment_method: payment_method },
          { new: true, lean: true } // `lean: true` converts Mongoose document to a plain object
        );

        if (!bill) {
          return {
            status: 404,
            message: "Bill not found.",
          };
        }

        return {
          status: 200,
          message: "Payment method updated successfully.",
          data: bill, // Now it's a plain JSON object
        };
      } catch (error: any) {
        console.error("Error updating payment method:", error);
        return {
          status: 500,
          message: "Internal server error.",
          error: error.message,
        };
      }
    }
  );

  ipcMain.handle(
    "pay-credit-bill-balance",
    async (_, { bill_number, received_amount }) => {
      try {
        console.log("pay-credit-bill-balance", bill_number, received_amount);

        // Find the bill by bill_number using .lean() to get a plain JavaScript object
        const bill = await BillsModel.findOne({ bill_number }).lean();

        if (!bill) {
          return {
            status: 404,
            message: "Bill not found.",
          };
        }

        // Calculate updated values
        const updatedAmountPaid =
          Number(bill.amount_paid) + Number(received_amount);
        const updatedBalance = Number(bill.balance) - Number(received_amount);
        const isPaid = updatedAmountPaid >= Number(bill.total_amount);

        // Update the bill in the database
        const updatedBill = await BillsModel.findOneAndUpdate(
          { bill_number },
          {
            amount_paid: updatedAmountPaid,
            balance: updatedBalance,
            paid: isPaid,
          },
          { new: true, lean: true } // Return updated document as a plain object
        );

        return {
          status: 200,
          message: "Balance amount received",
          data: JSON.parse(JSON.stringify(updatedBill)),
        };
      } catch (error: any) {
        console.error("Error updating bill:", error);
        return {
          status: 500,
          message: "Internal server error.",
          error: error.message,
        };
      }
    }
  );

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

ipcMain.handle("create-return-bill-history", async (_, data) => {
  try {
    console.log("Creating return bill:", data);

    const newReturnBill = new ReturnBillsHistoryModel(data);
    await newReturnBill.save();

    return {
      status: 201,
      message: "Return bill created successfully.",
      data: newReturnBill.toObject(), // FIXED
    };
  } catch (error: any) {
    console.error("Error creating return bill:", error);
    return {
      status: 500,
      message: "Internal server error.",
      error: error.message,
    };
  }
});

ipcMain.handle("get-return-bills-history", async (_, { bill_number }) => {
  try {
    console.log("Fetching return bills for:", bill_number);

    const returnBills = await ReturnBillsHistoryModel.find({
      bill_number,
    }).lean();

    if (!returnBills.length) {
      return {
        status: 404,
        message: "No return bills found for this bill number.",
      };
    }

    return {
      status: 200,
      message: "Return bills fetched successfully.",
      data: JSON.parse(JSON.stringify(returnBills)),
    };
  } catch (error: any) {
    console.error("Error fetching return bills:", error);
    return {
      status: 500,
      message: "Internal server error.",
      error: error.message,
    };
  }
});

ipcMain.handle("get-dashboard-data", async (_event, { fromDate, toDate }) => {
  console.log(
    "fromData",
    fromDate,
    toDate,
    "====>",
    new Date(fromDate).setUTCHours(0, 0, 0, 0),
    "shiushd=>",
    new Date(toDate).setUTCHours(23, 59, 59, 999)
  );

  // Construct the query object dynamically
  const query: any = {
    createdAt: {
      $gte: new Date(fromDate).setUTCHours(0, 0, 0, 0),
      $lte: new Date(toDate).setUTCHours(23, 59, 59, 999),
    },
    payment_method: { $ne: "Self Use" },
  };

  const bills = await BillsModel.find(query).lean(); // Use lean() for better performance
  console.log("bills list", bills);
  let totalRevenue = 0;
  let totalProfit = 0;

  // finding revenue and profit by Iterate over each bill
  bills.forEach((bill) => {
    // Iterate over each item in the bill
    bill.itemsList.forEach((item) => {
      let itemRevenue = 0;
      let itemProfit = 0;

      // Calculate revenue and profit based on unit of measurement (uom)
      if (item.uom === "gram") {
        itemRevenue = (item.rate / 1000) * item.qty;
        itemProfit = ((item.rate - item.purchased_rate) / 1000) * item.qty;
      } else {
        itemRevenue = item.rate * item.qty;
        itemProfit = (item.rate - item.purchased_rate) * item.qty;
      }

      // Accumulate totals
      totalRevenue += itemRevenue;
      totalProfit += itemProfit;
    });
  });

  // Aggregate revenue by date
  const revenueByDate = bills.reduce((acc, bill) => {
    const date = new Date(new Date(bill.createdAt).setUTCHours(0, 0, 0, 0)).toLocaleDateString("en-GB");

    const amount = bill.total_amount;

    if (acc[date]) {
      acc[date] += amount;
    } else {
      acc[date] = amount;
    }

    return acc;
  }, {});

  // Convert the aggregated object into an array of { date, amount } objects
  const revenueByDateArray = Object.keys(revenueByDate).map((date) => ({
    date,
    amount: revenueByDate[date],
  }));

  // Sort the array by date
  revenueByDateArray.sort((a, b) => {
    const [dayA, monthA, yearA] = a.date.split("/").map(Number);
    const [dayB, monthB, yearB] = b.date.split("/").map(Number);
    return (
      new Date(yearA, monthA - 1, dayA).getTime() -
      new Date(yearB, monthB - 1, dayB).getTime()
    );
  });

  // top selling product
  const productMap = new Map();

  bills.forEach((bill) => {
    bill.itemsList.forEach((item) => {
      const key = item.item_name;

      let adjustedQty = item.qty;
      if (item.uom === "gram") {
        adjustedQty = item.qty / 1000;
      }

      const itemRevenue =
        item.uom === "gram"
          ? (item.rate / 1000) * item.qty
          : item.rate * item.qty;

      if (!productMap.has(key)) {
        productMap.set(key, {
          sales: 0,
          revenue: 0,
        });
      }

      const existing = productMap.get(key);
      existing.sales += adjustedQty;
      existing.revenue += itemRevenue;
    });
  });

  const topProducts = [...productMap.entries()]
    .sort((a, b) => b[1].sales - a[1].sales)
    .slice(0, 10)
    .map(([name, data], index) => ({
      id: index + 1,
      name,
      sales: Math.round(data.sales),
      revenue: Math.round(data.revenue),
      rank: index + 1,
    }));

  //top customer

  const customerMap = new Map();

  bills.forEach((bill) => {
    if (bill.payment_method === "Credit Bill") {
      const name = bill.customer_name || "Unknown";
      if (!customerMap.has(name)) {
        customerMap.set(name, { customer: name, amount: 0 });
      }
      customerMap.get(name).amount += bill.total_amount;
    }
  });

  const topCustomers = [...customerMap.values()]
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 10)
    .map((customer, index) => ({
      id: index + 1,
      name: customer.customer,
      amount: customer.amount,
      rank: index + 1,
    }));

  //payment summary

  const methodMap = new Map();

  bills.forEach((bill) => {
    const method = bill.payment_method || "Unknown";
    if (!methodMap.has(method)) {
      methodMap.set(method, 0);
    }
    methodMap.set(method, methodMap.get(method) + bill.total_amount);
  });

  const paymentSummary = [...methodMap.entries()].map(([name, value]) => ({
    name,
    value,
  }));

  let data = {
    totalRevenue,
    totalProfit,
    totalorder: bills.length,
    salegraphdata: revenueByDateArray,
    topsellingproduct: topProducts,
    topcustomer: topCustomers,
    paymentSummary,
  };

  console.log("dashboard data", data);
  return {
    status: 200,
    message: "Bill updated successfully, and stock quantities adjusted.",

    data: JSON.parse(JSON.stringify(data)),
  };
});

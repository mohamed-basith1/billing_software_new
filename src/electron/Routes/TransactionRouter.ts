import { ipcMain } from "electron";
import TransactionSchema from "../models/TransactionModel.js";
import AuthendicationModel from "../models/AuthenticationModel.js";
import BillsModel from "../models/BillsModel.js";

export function TransactionRouter() {
  ipcMain.handle(
    "get-transaction-history",
    async (_event, { fromDate, toDate }) => {
      try {
        const startDate = new Date(fromDate);
        startDate.setUTCHours(0, 0, 0, 0);

        const endDate = new Date(toDate);
        endDate.setUTCHours(23, 59, 59, 999);
        console.log("start date", startDate, "end Date", endDate);
        const query = {
          createdAt: {
            $gte: startDate,
            $lte: endDate,
          },
        };

        const transactions = await TransactionSchema.find(query).sort({
          createdAt: -1,
        }); // Sort by newest firstlean();
        // console.log("transactions", transactions);
        // Transform the data
        const formattedTransactions = transactions.map(
          (transaction, index) => ({
            id: index + 1, // Sequential ID
            status: transaction.status,
            createdAt: transaction.createdAt.toISOString().split("T")[0], // Format date
            bill_no: transaction.bill_no || "", // Handle empty bill_no
            customer: transaction.customer || "", // Handle empty customer
            method: transaction.method,
            handler: transaction.handler,
            reason: transaction.reason,
            employee: transaction.employee,
            amount: `${transaction.status === "Increased" ? "+" : "-"}${
              transaction.amount
            }`,
          })
        );
        return {
          status: 200,
          message: "Transaction History List",
          data: JSON.parse(JSON.stringify(formattedTransactions)),
        };
      } catch (error: any) {
        console.error("Error fetching data:", error);
        throw error;
      }
    }
  );

  ipcMain.handle("get-last10transaction-history", async () => {
    try {
      const transactions = await TransactionSchema.find()
        .sort({ createdAt: -1 }) // Sort by newest first
        .limit(15) // Only get 15 documents
        .lean(); // Convert to plain JS objects

      // Transform the data
      const formattedTransactions = transactions.map((transaction, index) => ({
        id: index + 1, // Sequential ID
        status: transaction.status,
        createdAt: transaction.createdAt.toISOString().split("T")[0], // Format date
        bill_no: transaction.bill_no || "", // Handle empty bill_no
        customer: transaction.customer || "", // Handle empty customer
        method: transaction.method,
        handler: transaction.handler,
        reason: transaction.reason,
        employee: transaction.employee,
        amount: `${transaction.status === "Increased" ? "+" : "-"}${
          transaction.amount
        }`,
      }));
      return {
        status: 200,
        message: "Transaction History List",
        data: JSON.parse(JSON.stringify(formattedTransactions)),
      };
    } catch (error) {
      console.error("Error fetching transactions:", error);
      return {
        status: 500,
        message: "Failed to fetch transactions",
      };
    }
  });
  ipcMain.handle("get-transaction-summary", async () => {
    try {
      const transactions = await TransactionSchema.find().lean(); // Using lean() for better performance
      const creditBills = await BillsModel.find({
        payment_method: "Credit Bill",
      }).lean();

      // Initialize balances
      const summary = {
        amount_available: 0,
        upi_balance: 0,
        cash_balance: 0,
        total_outstanding: 0,
      };

      // Calculate balances
      transactions.forEach((transaction) => {
        const amount = transaction.amount || 0; // Handle undefined amounts
        const isIncrease = transaction.status === "Increased";

        // Update amount_available
        summary.amount_available += isIncrease ? amount : -amount;

        // Update method-specific balances
        if (transaction.method === "UPI Paid") {
          summary.upi_balance += isIncrease ? amount : -amount;
        } else if (transaction.method === "Cash Paid") {
          summary.cash_balance += isIncrease ? amount : -amount;
        }
      });

      summary.total_outstanding = creditBills.reduce((total, bill) => {
        return total + (bill.balance || 0);
      }, 0);

      // Round to 2 decimal places to avoid floating point precision issues
      summary.amount_available = parseFloat(
        summary.amount_available.toFixed(2)
      );
      summary.upi_balance = parseFloat(summary.upi_balance.toFixed(2));
      summary.cash_balance = parseFloat(summary.cash_balance.toFixed(2));
      summary.total_outstanding = parseFloat(
        summary.total_outstanding.toFixed(2)
      );

      return {
        status: 200,
        message: "Transaction Summary",
        data: JSON.parse(JSON.stringify(summary)),
      };
    } catch (error) {
      console.error("Error fetching transaction summary:", error);
      return {
        status: "error",
        message: "Failed to get transaction summary",
      };
    }
  });
  
  ipcMain.handle("add-transaction-history", async (_event, { data }) => {
    try {
      if (data.billtransactionhistory === false) {
        // 1. Find admin user
        const admin = await AuthendicationModel.findOne({
          role: "administrator",
        });

        if (!admin) {
          return {
            status: 404,
            message: "Admin account not found",
          };
        }

        // 2. Verify password (fixed comparison - was previously checking inequality)
        const isPasswordValid = data.password === admin.password;

        if (!isPasswordValid) {
          return {
            status: 403,
            message: "Invalid admin password",
          };
        }
      }

      const lastBill: any = await BillsModel.findOne().sort({ createdAt: -1 }); // Get latest bill
      let finalData = { ...data, bill_no: lastBill.bill_number };
      // 3. Create and save transaction
      const newTransaction = new TransactionSchema(finalData);

      const savedTransaction = await newTransaction.save();

      const formattedTransactions = [savedTransaction].map(
        (transaction, index) => ({
          id: index + 1, // Sequential ID
          status: transaction.status,
          createdAt: transaction.createdAt.toISOString().split("T")[0], // Format date
          bill_no: transaction.bill_no || "", // Handle empty bill_no
          customer: transaction.customer || "", // Handle empty customer
          method: transaction.method,
          handler: transaction.handler,
          reason: transaction.reason,
          employee: transaction.employee,
          amount: `${transaction.status === "Increased" ? "+" : "-"}${
            transaction.amount
          }`,
        })
      );
      // 4. Return simple object (not Mongoose document)
      return {
        status: 201,
        message: "Transaction added successfully",
        data: JSON.parse(JSON.stringify(formattedTransactions)),
      };
    } catch (error) {
      console.error("Transaction error:", error);
      return {
        status: 500,
        message: "Internal server error",
      };
    }
  });

  ipcMain.handle("add-bill-transaction-history", async (_event, { data }) => {
    try {
      // 3. Create and save transaction
      const newTransaction = new TransactionSchema(data);

      const savedTransaction = await newTransaction.save();

      const formattedTransactions = [savedTransaction].map(
        (transaction, index) => ({
          id: index + 1, // Sequential ID
          status: transaction.status,
          createdAt: transaction.createdAt.toISOString().split("T")[0], // Format date
          bill_no: transaction.bill_no || "", // Handle empty bill_no
          customer: transaction.customer || "", // Handle empty customer
          method: transaction.method,
          handler: transaction.handler,
          reason: transaction.reason,
          employee: transaction.employee,
          amount: `${transaction.status === "Increased" ? "+" : "-"}${
            transaction.amount
          }`,
        })
      );
      // 4. Return simple object (not Mongoose document)
      return {
        status: 201,
        message: "Transaction added successfully",
        data: JSON.parse(JSON.stringify(formattedTransactions)),
      };
    } catch (error) {
      console.error("Transaction error:", error);
      return {
        status: 500,
        message: "Internal server error",
      };
    }
  });
}

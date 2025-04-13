import { ipcMain } from "electron";
import moment from "moment";
import Customer from "../models/CustomersModel.js";
import BillsModel from "../models/BillsModel.js";

export function CustomersRouter() {
  // Create Customer
  ipcMain.handle("create-customer", async (_, data) => {
    try {
      const {
        customerName,
        customerAddress,
        customerArea,
        customerPincode,
        customerState,
        customerPrimaryContact,
        customerSecondaryContact,
        customerEmail,
      } = data;
      // Check if customer email already exists
      const existingCustomer = await Customer.findOne({ customerName });
      if (existingCustomer) {
        return {
          status: 409,
          message: "Customer with this name already exists.",
        };
      }
      // Check if primary contact already exists
      const existingCustomerByPrimaryContact: any = await Customer.findOne({
        customerPrimaryContact,
      });

      console.log(
        "existingCustomerByPrimaryContact",
        existingCustomerByPrimaryContact
      );

      if (existingCustomerByPrimaryContact) {
        if (existingCustomerByPrimaryContact?.customerPrimaryContact !== "") {
          return {
            status: 409,
            message: "Customer with this primary contact already exists.",
          };
        }
      }
      // Check if secondary contact already exists

      const existingCustomerBySecondaryContact: any = await Customer.findOne({
        customerSecondaryContact,
      });

      if (existingCustomerBySecondaryContact) {
        if (
          existingCustomerBySecondaryContact?.customerSecondaryContact !== ""
        ) {
          return {
            status: 409,
            message: "Customer with this secondary contact already exists.",
          };
        }
      }

      // Check if email already exists
      if (customerEmail) {
        const existingCustomerByEmail = await Customer.findOne({
          customerEmail,
        });
        if (existingCustomerByEmail) {
          return {
            status: 409,
            message: "Customer with this email already exists.",
          };
        }
      }
      // Create new customer
      const newCustomer = await Customer.create({
        customerName,
        customerAddress,
        customerArea,
        customerPincode,
        customerState,
        customerPrimaryContact,
        customerSecondaryContact,
        customerEmail,
      });
      return {
        status: 201,
        message: "Customer created successfully.",
        data: JSON.parse(JSON.stringify(newCustomer)),
      };
    } catch (error: any) {
      console.error("Error creating customer:", error);
      return {
        status: 500,
        message: "Internal server error.",
        error: error.message,
      };
    }
  });
  // Get All Customers
  ipcMain.handle("get-customers", async () => {
    try {
      const customers = await Customer.find().limit(15);
      return {
        status: 200,
        data: JSON.parse(JSON.stringify(customers)),
      };
    } catch (error: any) {
      console.error("Error fetching customers:", error);
      return {
        status: 500,
        message: "Internal server error.",
        error: error.message,
      };
    }
  });
  ipcMain.handle("search-customer", async (_, searchTerm) => {
    try {
      if (!searchTerm) return [];
      const items = await Customer.find({
        $or: [
          { customerName: { $regex: searchTerm, $options: "i" } },
          { customerPrimaryContact: { $regex: searchTerm, $options: "i" } },
          { customerSecondaryContact: { $regex: searchTerm, $options: "i" } },
        ],
      })
        .limit(13)
        .lean(); // Convert Mongoose documents to plain objects
      return {
        status: 200,
        data: JSON.parse(JSON.stringify(items)),
      };
    } catch (error: any) {
      console.error("Error searching items:", error);
      throw error;
    }
  });
  // Get Single Customer by ID
  ipcMain.handle("get-customer", async (_, customerId) => {
    try {
      const customer = await Customer.findById(customerId);
      if (!customer) {
        return {
          status: 404,
          message: "Customer not found.",
        };
      }
      return {
        status: 200,
        data: customer,
      };
    } catch (error: any) {
      console.error("Error fetching customer:", error);
      return {
        status: 500,
        message: "Internal server error.",
        error: error.message,
      };
    }
  });
  // Update Customer
  ipcMain.handle("update-customer", async (_, { id, updatedData }) => {
    try {
      const customer = await Customer.findByIdAndUpdate(id, updatedData, {
        new: true,
      });
      if (!customer) {
        return {
          status: 404,
          message: "Customer not found.",
        };
      }
      return {
        status: 200,
        message: "Customer updated successfully.",
        data: JSON.parse(JSON.stringify(customer)),
      };
    } catch (error: any) {
      console.error("Error updating customer:", error);
      return {
        status: 500,
        message: "Internal server error.",
        error: error.message,
      };
    }
  });
  // Delete Customer
  ipcMain.handle("delete-customer", async (_, customerId) => {
    try {
      const customer = await Customer.findByIdAndDelete(customerId);
      if (!customer) {
        return {
          status: 404,
          message: "Customer not found.",
        };
      }
      return {
        status: 200,
        message: "Customer deleted successfully.",
      };
    } catch (error: any) {
      console.error("Error deleting customer:", error);
      return {
        status: 500,
        message: "Internal server error.",
        error: error.message,
      };
    }
  });

  // Get Customer Bill History
  ipcMain.handle("get-customer-bill-history", async (_, customerId) => {
    try {
      const bills = await BillsModel.find({ customer_id: customerId });

      const formattedBills = bills.map((bill) => ({
        id: bill.createdAt,
        customer_id: bill.customer_id,
        total_amount: bill.total_amount,
        amount_paid: bill.amount_paid,
        paid: bill.paid,
        balance: bill.balance,
        bill_number: bill.bill_number,
        createdAt: moment(bill.createdAt).format("DD/MM/YYYY"), // Formatting Date
      }));

      return {
        status: 200,
        data: formattedBills,
        message: "Fetched customer bill history successfully.",
      };
    } catch (error: any) {
      console.error("Error fetching customer bill history:", error);
      return {
        status: 500,
        message: "Internal server error.",
        error: error.message,
      };
    }
  });
}

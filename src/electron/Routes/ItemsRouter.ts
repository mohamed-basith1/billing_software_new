import { ipcMain } from "electron";
import Item from "../models/ItemsModel.js";
export function ItemsRouter() {
  ipcMain.handle("insert-item", async (_, data) => {
    try {
      // Check if an item with the same item_name or code exists
      const normalizeString = (str) => str.replace(/\s+/g, "").toLowerCase();

      const existingItem = await Item.findOne({
        $or: [
          {
            item_name: {
              $regex: new RegExp(`^${normalizeString(data.item_name)}$`, "i"),
            },
          },
          { code: data.code },
        ],
      });

      if (existingItem) {
        return {
          status: 404,
          message: "Item already exists! Please use a different name and code.",
        };
        throw new Error("Item with the same name or code already exists.");
      }
      // Insert the new item
      const item = await Item.create(data);
      return {
        status: 201,
        message: "Item Created Successfully!",
        data: JSON.parse(JSON.stringify(item)),
      };
    } catch (error: any) {
      console.error("Error inserting data:", error);
      throw error;
    }
  });
  ipcMain.handle("search-item", async (_, searchTerm) => {
    try {
      if (!searchTerm) return [];
      const items = await Item.find({
        $or: [
          { item_name: { $regex: searchTerm, $options: "i" } },
          { code: { $regex: searchTerm, $options: "i" } },
        ],
      })
        .limit(8)
        .lean(); // Convert Mongoose documents to plain objects
      return JSON.parse(JSON.stringify(items));
    } catch (error: any) {
      console.error("Error searching items:", error);
      throw error;
    }
  });
  ipcMain.handle("get-item", async () => {
    try {
      console.log("item list api");
      const items = await Item.find();
      return JSON.parse(JSON.stringify(items)); // No need for .toObject()
    } catch (error: any) {
      console.error("Error fetching data:", error);
      throw error;
    }
  });

  ipcMain.handle("get-low-stock-item", async () => {
    try {
      console.log("item list api");

      // Fetch only items where stock_qty is lower than low_stock_remainder
      const items = await Item.find({
        $expr: { $lt: ["$stock_qty", "$low_stock_remainder"] },
      });

      return JSON.parse(JSON.stringify(items)); // Convert Mongoose documents to plain objects
    } catch (error: any) {
      console.error("Error fetching data:", error);
      throw error;
    }
  });

  ipcMain.handle("get-item-summary", async () => {
    try {
      const items: any = await Item.find();

      const total_items = items.length;

      const low_stock_item = items.filter(
        (item) => item.stock_qty < item.low_stock_remainder
      ).length;

      const total_item_price = items.reduce((sum, item) => {
        if (item.uom.toLowerCase() === "gram") {
          return sum + (item.stock_qty / 1000) * item.amount; // Convert grams to kg
        }
        return sum + item.stock_qty * item.amount;
      }, 0);

      return {
        status: 200,
        data: { total_items, low_stock_item, total_item_price },
      };
    } catch (error: any) {
      console.error("Error fetching data:", error);
      throw error;
    }
  });

  ipcMain.handle("update-item", async (_, id, newStockEntry) => {
    try {
      const updatedItem = await Item.findByIdAndUpdate(
        id,
        {
          $inc: { stock_qty: newStockEntry.stock_qty }, // Increment stock quantity
          $push: {
            new_stock: {
              ...newStockEntry,
              createdAt: new Date().toISOString(), // Add current date/time
            },
          },
        },
        { new: true }
      );

      return {
        status: 200,
        message: "New Stock Uploaded Successfully!",
        data: updatedItem ? JSON.parse(JSON.stringify(updatedItem)) : null,
      };
    } catch (error: any) {
      console.error("Error updating data:", error);
      return {
        status: 500,
        message: "Failed to update stock!",
      };
    }
  });

  ipcMain.handle("delete-item", async (_, id) => {
    try {
      const deletedItem = await Item.findByIdAndDelete(id);
      return deletedItem ? JSON.parse(JSON.stringify(deletedItem)) : null;
    } catch (error: any) {
      console.error("Error deleting data:", error);
      throw error;
    }
  });

  ipcMain.handle("filter-items-by-date", async (_, createdAtFilter) => {
    try {
      if (!createdAtFilter) {
        console.log("❌ Invalid date filter provided!");
        return {
          status: 400,
          message: "Invalid date filter!",
          data: null,
        };
      }

      // Convert the input date to UTC format
      const date = new Date(createdAtFilter);

      const startDate = new Date(createdAtFilter);
      startDate.setUTCHours(0, 0, 0, 0);

      const endDate = new Date(createdAtFilter);
      endDate.setUTCHours(23, 59, 59, 999);

      const query = {
        "new_stock.createdAt": {
          $gte: startDate.toISOString(), // Directly use the Date object
          $lt: endDate.toISOString(),
        },
      };

      // Fetch items from MongoDB
      const items = await Item.find(query).lean();

      if (!items.length) {
        console.log("⚠️ No items found for the selected date.");
        return {
          status: 200,
          message: "No items found for the selected date.",
          data: [],
        };
      }

      // Process and filter results
      const filteredItems = items.flatMap((item) => {
        const result: any = [];

        // Check if main document's createdAt is within range
        const itemCreatedAt = new Date(item.createdAt);

        // Check if new_stock exists and filter stock items
        if (Array.isArray(item.new_stock)) {
          item.new_stock.forEach((stock) => {
            const stockCreatedAt = new Date(stock.createdAt);
            if (stockCreatedAt >= startDate && stockCreatedAt < endDate) {
              result.push({
                item_name: stock.item_name,
                code: stock.code,
                amount: stock.amount,
                purchased_rate: stock.purchased_rate,
                rate: stock.rate,
                uom: stock.uom,
                stock_qty: stock.stock_qty,
                item_expiry_date: stock.item_expiry_date,
                createdAt: stock.createdAt,
              });
            }
          });
        }

        return result;
      });

      return {
        status: 200,
        message: "Filtered items retrieved successfully!",
        data:
          filteredItems.length > 0
            ? filteredItems?.sort(
                (a, b) =>
                  new Date(a.createdAt).getTime() -
                  new Date(b.createdAt).getTime()
              )
            : [],
      };
    } catch (error) {
      console.error("❌ Error filtering items by date:", error);
      return {
        status: 500,
        message: "Internal Server Error",
        data: null,
      };
    }
  });
}

import { ipcMain } from "electron";
import Item from "../models/Item.js";

export function BillingRouter() {
  ipcMain.handle("insert-item", async (_, data) => {
    try {
      // Check if an item with the same item_name or code exists
      const existingItem = await Item.findOne({
        $or: [{ item_name: data.item_name }, { code: data.code }],
      });

      if (existingItem) {
        throw new Error("Item with the same name or code already exists.");
      }

      // Insert the new item
      const item = await Item.create(data);

      return JSON.parse(JSON.stringify(item)); // No need for .toObject()
    } catch (error) {
      console.error("Error inserting data:", error);
      throw error;
    }
  });

  ipcMain.handle("search-item", async (_, searchTerm) => {
    try {
      console.log("searchTerm", searchTerm);
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
    } catch (error) {
      console.error("Error searching items:", error);
      throw error;
    }
  });

  ipcMain.handle("get-item", async () => {
    try {
      const items = await Item.find();
      return JSON.parse(JSON.stringify(items)); // No need for .toObject()
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  });

  ipcMain.handle("update-item", async (_, id, newData) => {
    try {
      const updatedItem = await Item.findByIdAndUpdate(id, newData, {
        new: true,
      });
      return updatedItem ? JSON.parse(JSON.stringify(updatedItem)) : null;
    } catch (error) {
      console.error("Error updating data:", error);
      throw error;
    }
  });

  ipcMain.handle("delete-item", async (_, id) => {
    try {
      const deletedItem = await Item.findByIdAndDelete(id);
      return deletedItem ? JSON.parse(JSON.stringify(deletedItem)) : null;
    } catch (error) {
      console.error("Error deleting data:", error);
      throw error;
    }
  });
}

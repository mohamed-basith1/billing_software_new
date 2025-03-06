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
      const items = await Item.find();
      return JSON.parse(JSON.stringify(items)); // No need for .toObject()
    } catch (error: any) {
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
    } catch (error: any) {
      console.error("Error updating data:", error);
      throw error;
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
}

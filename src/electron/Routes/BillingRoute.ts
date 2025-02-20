import { ipcMain } from "electron";
import Item from "../models/Item.js";

export function BillingRouter() {
  ipcMain.handle("insert-data", async (_, data) => {
    const item = await Item.create(data);
    return JSON.parse(JSON.stringify(item.toObject())); 
  });

  ipcMain.handle("get-data", async () => {
    const items = await Item.find();
    return items.map((item) => JSON.parse(JSON.stringify(item.toObject())));
  });

  ipcMain.handle("update-data", async (_, id, newData) => {
    const updatedItem = await Item.findByIdAndUpdate(id, newData, { new: true });
    return updatedItem ? JSON.parse(JSON.stringify(updatedItem.toObject())) : null;
  });

  ipcMain.handle("delete-data", async (_, id) => {
    const deletedItem = await Item.findByIdAndDelete(id);
    return deletedItem ? JSON.parse(JSON.stringify(deletedItem.toObject())) : null;
  });
}

import { app, BrowserWindow, ipcMain } from "electron";
import connectDB from "./db.js";
import Item from "./models/Item.js";
import { isDev } from "./utils.js";
import { getPreloadPath, getUIPath } from "./pathResolver.js";
import { BillingRouter } from "./Routes/BillingRoute.js";

app.on("ready", async () => {
  await connectDB();
  BillingRouter()
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: getPreloadPath(),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });
  if (isDev()) {
    mainWindow.loadURL(getUIPath());
  } else {
    mainWindow.loadFile(getUIPath());
  }
});

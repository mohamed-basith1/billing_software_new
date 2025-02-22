import { app, BrowserWindow, ipcMain } from "electron";
import connectDB from "./db.js";
import Item from "./models/Item.js";
import { isDev } from "./utils.js";
import { getPreloadPath, getUIPath } from "./pathResolver.js";
import { BillingRouter } from "./Routes/BillingRoute.js";
import { AuthenticationRouter } from "./Routes/Authentication.js";

app.commandLine.appendSwitch("disable-features", "AutofillServerCommunication");
app.commandLine.appendSwitch("disable-features", "AutofillAddressServerSuggestion");
app.on("ready", async () => {
  await connectDB();

  BillingRouter()
  AuthenticationRouter()
  const mainWindow = new BrowserWindow({
  
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

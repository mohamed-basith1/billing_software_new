import { app, BrowserWindow } from "electron";
import connectDB from "./db.js";

import { isDev } from "./utils.js";
import { getPreloadPath, getUIPath } from "./pathResolver.js";

import { ItemsRouter } from "./Routes/ItemsRouter.js";
import { AuthenticationRouter } from "./Routes/AuthenticationRouter.js";
import { CustomersRouter } from "./Routes/CustomersRouter.js";
import { BillsRouter } from "./Routes/BillsRouter.js";
import { TransactionRouter } from "./Routes/TransactionRouter.js";

app.commandLine.appendSwitch("disable-features", "AutofillServerCommunication");
app.commandLine.appendSwitch(
  "disable-features",
  "AutofillAddressServerSuggestion"
);
app.on("ready", async () => {
  await connectDB();

  ItemsRouter();
  AuthenticationRouter();
  CustomersRouter();
  BillsRouter();
  TransactionRouter();

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

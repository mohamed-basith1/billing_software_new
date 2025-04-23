import { app, BrowserWindow } from "electron";
import connectDB from "./db.js";

import { isDev } from "./utils.js";
import { getPreloadPath, getUIPath } from "./pathResolver.js";

import { ItemsRouter } from "./Routes/ItemsRouter.js";
import { AuthenticationRouter } from "./Routes/AuthenticationRouter.js";
import { CustomersRouter } from "./Routes/CustomersRouter.js";
import { BillsRouter } from "./Routes/BillsRouter.js";
import { TransactionRouter } from "./Routes/TransactionRouter.js";
import { DealerBillRouter } from "./Routes/DealerBillHistory.js";
import startMongo from "./startMongo.js";

app.commandLine.appendSwitch("disable-features", "AutofillServerCommunication");
app.commandLine.appendSwitch(
  "disable-features",
  "AutofillAddressServerSuggestion"
);
app.on("ready", async () => {
  startMongo(); // ✅ Ensure MongoDB is running before connecting

  // Wait a couple seconds to allow MongoDB to spin up
  await new Promise((resolve) => setTimeout(resolve, 1000));
  await connectDB();

  ItemsRouter();
  AuthenticationRouter();
  CustomersRouter();
  BillsRouter();
  TransactionRouter();
  DealerBillRouter();

  const mainWindow = new BrowserWindow({
    webPreferences: {
      preload: getPreloadPath(),
      nodeIntegration: false,
      contextIsolation: true,
      // devTools: false,
    },
  });
  if (isDev()) {
    mainWindow.loadURL(getUIPath());
  } else {
    mainWindow.loadFile(getUIPath());
  }
});

import { app, BrowserWindow, ipcMain, Menu } from "electron";
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
import posPrinterPkg from "electron-pos-printer";
const { PosPrinter } = posPrinterPkg;

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
    autoHideMenuBar: true,
    webPreferences: {
      preload: getPreloadPath(),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  // Menu.setApplicationMenu(null);
  if (isDev()) {
    mainWindow.loadURL(getUIPath());
  } else {
    mainWindow.loadFile(getUIPath());
  }

  // ✅ IPC handler for POS print request
  ipcMain.handle("print-receipt", async (event, printData: any) => {
    const options: any = {
      preview: true,
      margin: "0 0 0 0",
      copies: 1,
      printerName: "", // default printer
      timeOutPerLine: 400,
      pageSize: "80mm",
    };
    await PosPrinter.print(printData, options);
    return { success: true };
  });
});

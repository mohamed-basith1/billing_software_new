import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  // Items API
  getItem: () => ipcRenderer.invoke("get-item"),
  getLowStockItem: () => ipcRenderer.invoke("get-low-stock-item"),

  insertItem: (data) => ipcRenderer.invoke("insert-item", data),
  updateItem: (id, newData) => ipcRenderer.invoke("update-item", id, newData),
  deleteItem: (id) => ipcRenderer.invoke("delete-item", id),
  searchItem: (id) => ipcRenderer.invoke("search-item", id),
  itemSummary: () => ipcRenderer.invoke("get-item-summary"),

  filterByData: (createdAtFilter) =>
    ipcRenderer.invoke("filter-items-by-date", createdAtFilter),

  // Authentication API
  createAccount: (data) => ipcRenderer.invoke("create-account", data),
  loginAPI: (data) => ipcRenderer.invoke("login-api", data),
  getEmployee: () => ipcRenderer.invoke("get-employee-list"),

  // Customers API
  createCustomer: (data) => ipcRenderer.invoke("create-customer", data),
  getCustomers: () => ipcRenderer.invoke("get-customers"),
  getCustomer: (id) => ipcRenderer.invoke("get-customer", id),
  updateCustomer: (id, updatedData) =>
    ipcRenderer.invoke("update-customer", { id, updatedData }),
  deleteCustomer: (id) => ipcRenderer.invoke("delete-customer", id),
  searchCustomer: (data) => ipcRenderer.invoke("search-customer", data),
  getCustomerBillHistory: (id) =>
    ipcRenderer.invoke("get-customer-bill-history", id),

  // Bills API
  createBill: (data) => ipcRenderer.invoke("create-bill", data),
  getBills: (fromDate, toDate, payment_method) =>
    ipcRenderer.invoke("get-bills", { fromDate, toDate, payment_method }),
  getBillBySearch: (bill_number, payment_method) =>
    ipcRenderer.invoke("get-bill-by-search", { bill_number, payment_method }),
  returnBill: (id, updatedData, tempRemoveItem) =>
    ipcRenderer.invoke("return-bill", { id, updatedData, tempRemoveItem }),
  returnPendingAmount: (id, returnPendingAmount) =>
    ipcRenderer.invoke("return-pending-amount", { id, returnPendingAmount }),
  updateBill: (id, updatedData) =>
    ipcRenderer.invoke("update-bill", { id, updatedData }),
  payCreditBillBalance: (bill_number, received_amount) =>
    ipcRenderer.invoke("pay-credit-bill-balance", {
      bill_number,
      received_amount,
    }),
  updateBillPaymentMethod: (id, payment_method) =>
    ipcRenderer.invoke("update-bill-payment-method", { id, payment_method }),
  deleteBill: (id) => ipcRenderer.invoke("delete-bill", id),

  // Return Bill History API
  createBillReturnHistory: (data) =>
    ipcRenderer.invoke("create-return-bill-history", data),
  getReturnBillsHistory: (bill_number) =>
    ipcRenderer.invoke("get-return-bills-history", { bill_number }),

  //dashboard
  getDashboardData: (fromDate, toDate) =>
    ipcRenderer.invoke("get-dashboard-data", { fromDate, toDate }),

  // Transaction History

  getTransactionSummary: () => ipcRenderer.invoke("get-transaction-summary"),
  getTransactionHistory: (fromDate, toDate) =>
    ipcRenderer.invoke("get-transaction-history", { fromDate, toDate }),

  getLast10TransactionHistory: () =>
    ipcRenderer.invoke("get-last10transaction-history"),

  addTransactionHistory: (data) =>
    ipcRenderer.invoke("add-transaction-history", { data }),
});

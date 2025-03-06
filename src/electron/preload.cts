import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  // Items API
  getItem: () => ipcRenderer.invoke("get-item"),
  insertItem: (data) => ipcRenderer.invoke("insert-item", data),
  updateItem: (id, newData) => ipcRenderer.invoke("update-item", id, newData),
  deleteItem: (id) => ipcRenderer.invoke("delete-item", id),
  searchItem: (id) => ipcRenderer.invoke("search-item", id),

  // Authentication API
  createAccount: (data) => ipcRenderer.invoke("create-account", data),
  loginAPI: (data) => ipcRenderer.invoke("login-api", data),

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
  getBills: () => ipcRenderer.invoke("get-bills"),
  getBill: (id) => ipcRenderer.invoke("get-bill", id),
  updateBill: (id, updatedData) =>
    ipcRenderer.invoke("update-bill", { id, updatedData }),
  deleteBill: (id) => ipcRenderer.invoke("delete-bill", id),
});

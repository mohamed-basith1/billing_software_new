import { contextBridge, ipcRenderer } from "electron";


contextBridge.exposeInMainWorld("electronAPI", {
  getItem: () => ipcRenderer.invoke("get-item"),
  insertItem: (data:string) => ipcRenderer.invoke("insert-item", data),
  updateItem: (id: string, newData: object) =>
    ipcRenderer.invoke("update-data", id, newData),
  deleteItem: (id: string) => ipcRenderer.invoke("delete-item", id),
  searchItem: (id: string) => ipcRenderer.invoke("search-item", id),
  
});

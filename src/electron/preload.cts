import { contextBridge, ipcRenderer } from "electron";


contextBridge.exposeInMainWorld("electronAPI", {
  getData: () => ipcRenderer.invoke("get-data"),
  insertData: (data:string) => ipcRenderer.invoke("insert-data", data),
  updateData: (id: string, newData: object) =>
    ipcRenderer.invoke("update-data", id, newData),
  deleteData: (id: string) => ipcRenderer.invoke("delete-data", id),
});

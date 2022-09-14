import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import { print, getPrinters, PrintOptions } from 'pdf-to-printer';
contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    sendMessage(channel: string, args: unknown[]) {
      ipcRenderer.send(channel, args);
    },
    on(channel: string, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      return () => ipcRenderer.removeListener(channel, subscription);
    },
    once(channel: string, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
    invoke(channel: string, ...args: any[]) {
      return ipcRenderer.invoke(channel, ...args);
    },
  },
});

contextBridge.exposeInMainWorld('pdf-to-printer', {
  printer: {
    print(pdf: string, options?: PrintOptions) {
      return print(pdf, options);
    },
    getPrinters() {
      return getPrinters();
    },
  },
});

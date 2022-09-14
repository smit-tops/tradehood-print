import { PrintOptions, Printer } from 'pdf-to-printer';

declare global {
  interface Window {
    electron: {
      ipcRenderer: {
        sendMessage(channel: string, args: any): void;
        on(
          channel: string,
          func: (...args: unknown[]) => void
        ): (() => void) | undefined;
        once(channel: string, func: (...args: unknown[]) => void): void;
        invoke(channel: string, ...args: any[]): Promise<any>;
      };
    };
    'pdf-to-printer': {
      printer: {
        print(pdf: string, options?: PrintOptions): Promise<void>;
        getPrinters(): Promise<Printer[]>;
      };
    };
  }
}

export {};

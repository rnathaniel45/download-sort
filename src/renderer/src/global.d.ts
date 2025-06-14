export {}; // Ensure this file is a module

declare global {
  interface Window {
    electron: {
      ipcRenderer: {
        invoke(channel: string, ...args: any[]): Promise<any>;
        // add other ipcRenderer methods if needed
      };
      process: {
        versions: {
          node: string;
          chrome: string;
          electron: string;
        };
      };
      // add other exposed APIs here if you have any
    };

    api: {
      versions: {
        node: () => string;
        chrome: () => string;
        electron: () => string;
      };
    };
  }
}

import { ipcMain, clipboard, shell } from "electron";
import Store from "electron-store";
import LightNode from "./LightNode";

interface LightNodes {
  [key: string]: LightNode;
}

const lightNodes: LightNodes = {};

const store = new Store();

// handle IPC for clipboard
ipcMain.on("clipboard", (_, text) => {
  clipboard.writeText(text);
});

// handle IPC to start light node
ipcMain.on("start-node", async (event, chain) => {
  lightNodes[chain] = new LightNode(chain, event);
  lightNodes[chain].start();
});

// handle IPC to stop light node
ipcMain.on("stop-node", async (event, chain) => {
  lightNodes[chain]?.stop();
});

// open browser: http://bit.ly/46El84o
ipcMain.on("open-external", async (_, url) => {
  shell.openExternal(url);
});

// set store in Address.tsx
ipcMain.on("set-store", async (event, keyVal) => {
  store.set(keyVal[0], keyVal[1]);
  event.reply("reply-store", keyVal);
});

ipcMain.handle("get-store", (_, key) => {
  return store.get(key);
});

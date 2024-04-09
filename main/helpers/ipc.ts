import { ipcMain, clipboard, shell } from "electron";
import { app } from "electron";
import { store } from "./store";
import axios from "axios";
import LightNode from "./LightNode";
import isDev from "electron-is-dev";
import { mainWindow } from "../background";

interface LightNodes {
  [key: string]: LightNode;
}

const lightNodes: LightNodes = {};

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

ipcMain.on("delete-store", async (event, key) => {
  store.delete(key);
  event.reply("reply-store", [key, undefined]);
});

ipcMain.handle("get-store", (_, key) => {
  return store.get(key);
});

ipcMain.handle("fetch", async (_, url) => {
  console.log("SFDSDF", url);
  return axios.get(url).then((res) => res.data);
});

ipcMain.on("toggle-dev", () => {
  mainWindow.webContents.toggleDevTools();
});

ipcMain.on("minimize", async (event) => {
  mainWindow.hide();
});

ipcMain.on("close", async (event) => {
  mainWindow.close();
});

import { ipcMain, clipboard, shell } from "electron";
import Store from "electron-store";
import axios from "axios";
import LightNode from "./LightNode";
import isDev from "electron-is-dev";

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

ipcMain.on("delete-store", async (event, key) => {
  store.delete(key);
  event.reply("reply-store", [key, undefined]);
});

ipcMain.handle("get-store", (_, key) => {
  return store.get(key);
});

ipcMain.on("refresh-auth", async (event, key) => {
  const auth = store.get("authenticate");
  const url = isDev
    ? `http://localhost:3000/joinedDiscord?code=${auth}`
    : `https://auth.lestian.com/joinedDiscord?code=${auth}`;
  const { data } = await axios.get(url);
  if (data.user) {
    store.set("discord", true);
    event.reply("reply-store", ["discord", true]);
  }
});

ipcMain.on("save-address", async (event, address) => {
  const code = store.get("authenticate");
  if (!code) return;
  const url = isDev
    ? `http://localhost:3000/saveAddress?address=${address}&code=${code}`
    : `https://api.lestian.com/saveAddress?address=${address}&code=${code}`;
  const { data } = await axios.get(url);
  if (data.success) {
    store.set("address", address);
    event.reply("reply-store", ["address", address]);
  }
});

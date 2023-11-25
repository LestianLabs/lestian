import { ipcMain, clipboard } from "electron";
import LightNode from "./LightNode";

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

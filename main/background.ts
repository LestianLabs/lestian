import path from "path";
import { app, ipcMain, clipboard } from "electron";
import serve from "electron-serve";
import { createWindow } from "./helpers";
import LightNode from "./helpers/LightNode";

const isProd = process.env.NODE_ENV === "production";

if (isProd) {
  serve({ directory: "app" });
} else {
  app.setPath("userData", `${app.getPath("userData")} (development)`);
}

(async () => {
  await app.whenReady();

  const mainWindow = createWindow("main", {
    width: 1000,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  if (isProd) {
    await mainWindow.loadURL("app://./home");
  } else {
    const port = process.argv[2];
    await mainWindow.loadURL(`http://localhost:${port}/home`);
    mainWindow.webContents.openDevTools();
  }
})();

app.on("window-all-closed", () => {
  app.quit();
});

// handle IPC for clipboard
ipcMain.on("clipboard", (_, text) => {
  clipboard.writeText(text);
});

// handle IPC for light nodes
ipcMain.on("start-node", async (event, chain) => {
  // key value from binaries.json
  const lightNode = new LightNode(chain, event);
  await lightNode.start();
});

ipcMain.on("stop-node", async () => {
  console.log("BACGROUND.ts::SOTPPPING NODE");
});

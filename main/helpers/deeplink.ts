import { app } from "electron";
import isDev from "electron-is-dev";
import { Deeplink } from "electron-deeplink";
import { mainWindow } from "../background";

const deeplink = new Deeplink({
  app,
  mainWindow: null,
  protocol: "lestian",
  isDev,
});

// handle deep link: lestian://open?OAuthToken=token123
deeplink.on("received", (link: string) => {
  mainWindow.webContents.send("deep-link", link);
  // window.ipc.on("deep-link", (link) => {});
});

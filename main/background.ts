import path from "path";
import { app } from "electron";
import serve from "electron-serve";
import { createWindow } from "./helpers";
import "./helpers/ipc";
import "./helpers/deeplink";

if (process.env.NODE_ENV === "production") {
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

  if (process.env.NODE_ENV === "production") {
    await mainWindow.loadURL("app://./home");
  } else {
    const port = process.argv[2];
    await mainWindow.loadURL(`http://localhost:${port}/home`);
    mainWindow.webContents.openDevTools();
  }
})();

// handle window close
app.on("window-all-closed", () => {
  app.quit();
});

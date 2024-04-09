import path from "path";
import { app, Tray, nativeImage, Menu } from "electron";
import serve from "electron-serve";
import { createWindow } from "./helpers";

if (process.env.NODE_ENV === "production") {
  serve({ directory: "app" });
} else {
  app.setPath("userData", `${app.getPath("userData")} (development)`);
}

export let mainWindow;

(async () => {
  await app.whenReady();

  // create main window
  mainWindow = createWindow("main", {
    width: 410,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  // hide dock icon
  app.dock?.hide();

  // https://stackoverflow.com/questions/41664208/electron-tray-icon-change-depending-on-dark-theme/41998326#41998326
  const tray = new Tray(
    nativeImage
      .createFromPath(path.join(__dirname, "../resources/tray.png"))
      .resize({ width: 16 })
  );

  tray.setContextMenu(
    Menu.buildFromTemplate([
      { label: "Lestian", click: () => mainWindow.show() },
      { label: "Quit", click: () => app.quit() },
    ])
  );

  // display main window
  if (process.env.NODE_ENV === "production") {
    await mainWindow.loadURL("app://./home");
  } else {
    const port = process.argv[2];
    await mainWindow.loadURL(`http://localhost:${port}/home`);
  }

  mainWindow.show();
})();

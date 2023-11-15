import fs from "fs";
import { BrowserWindow } from "electron";
import isDev from "electron-is-dev";
import os from "os";
import { exec } from "child_process";
import { download } from "electron-dl";
import extract from "extract-zip";
import appRootDir from "app-root-dir";
import { join, dirname } from "path";

export default class LightNode {
  chain: string; // key from this.binaries[CHAIN]
  event: Electron.IpcMainEvent; // ipc event to sent to UI
  tempPath: string; // to download & unzip binary. will rm after
  downloadPath: string; // path to run binary
  url: string; // url to download binary: https://github.com/foobar.zip

  // list of binaries
  binaries = {
    celestia: {
      file: "celestia", // binary file name
      darwin: {
        arm64:
          "https://github.com/Vistara-Labs/vimana/releases/download/celestia-v0.12.0/darwin_arm64.zip",
      },
      linux: {
        arm64:
          "https://github.com/Vistara-Labs/vimana/releases/download/celestia-v0.12.0/linux_arm64.zip",
        amd64:
          "https://github.com/Vistara-Labs/vimana/releases/download/celestia-v0.12.0/linux_amd64.zip",
      },
    },
  };

  constructor(chain: string, event?: Electron.IpcMainEvent) {
    this.chain = chain;
    this.event = event;
    this.tempPath = isDev
      ? join(appRootDir.get(), "main", "binaries", "temp")
      : join(dirname(appRootDir.get()), "bin", "temp");
    this.downloadPath = isDev
      ? join(appRootDir.get(), "main", "binaries")
      : join(dirname(appRootDir.get()), "bin");
    this.url = this.binaries[this.chain][this.platform()][this.architecture()];
  }

  start = async (): Promise<void> => {
    try {
      if (await this.exists()) return;
      await this.deleteTemp();
      fs.mkdirSync(this.tempPath);
      const zip = await this.downloadZip(this.url);
      await this.unzip(zip);
      await this.move(zip);
      await this.deleteTemp();
    } catch (error) {
      await this.deleteTemp();
      console.log(error);
      return this.reply(error);
    }
  };

  // delete temp folder
  deleteTemp = async () => await fs.rmSync(this.tempPath, { recursive: true });

  // check if binary exists
  exists = async (): Promise<boolean> => {
    const hasBinary = await fs.existsSync(
      join(this.downloadPath, this.binaries[this.chain].file)
    );
    this.reply(`Binaries downloaded: ${hasBinary}`);
    return hasBinary;
  };

  // move binary to this.downloadPath
  move = async (zip: Electron.DownloadItem): Promise<void> => {
    this.reply(`Moving...`);
    return await fs.renameSync(
      join(zip.savePath.replace(".zip", ""), this.binaries[this.chain].file),
      join(this.downloadPath, this.binaries[this.chain].file)
    );
  };

  // unzip binary to this.tempPath
  unzip = async (zip: Electron.DownloadItem): Promise<void> => {
    this.reply(`Unzipping...`);
    return await extract(zip.savePath, {
      dir: this.tempPath,
      onEntry: (entry) => {
        this.reply(entry);
      },
    });
  };

  // download binary from url
  downloadZip = async (url: string): Promise<Electron.DownloadItem> => {
    this.event.reply("message", `Downloading...`);
    return await download(BrowserWindow.getFocusedWindow(), url, {
      directory: this.tempPath,
      onProgress: (progress) => {
        this.reply(progress);
      },
    });
  };

  // reply to electron console
  reply = (message: any) => {
    if (!this.event) return;
    this.event.reply("message", message);
  };

  // returns the platform name: 'darwin', 'linux' or 'win32'
  platform = () => os.platform();

  // returns the architecture name
  architecture = () => {
    let arch = os.arch(); // 'arm', 'arm64', 'x32', and 'x64'.
    if (arch == "arm" || arch == "arm64") arch = "arm64";
    if (arch == "x64") arch = "amd64";
    return arch;
  };
}

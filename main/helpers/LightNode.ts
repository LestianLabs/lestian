import fs from "fs";
import { ChildProcessWithoutNullStreams, spawn } from "child_process";
import { join, dirname } from "path";
import os from "os";
import { BrowserWindow } from "electron";
import isDev from "electron-is-dev";
import { ChildProcess } from "child_process";
import { download } from "electron-dl";
import extract from "extract-zip";
import appRootDir from "app-root-dir";

export default class LightNode {
  chain: string; // key from this.binaries[CHAIN]
  event: Electron.IpcMainEvent; // ipc event to sent to UI
  tempPath: string; // to download & unzip binary. will rm after
  downloadPath: string; // path to run binary
  url: string; // url to download binary: https://github.com/foobar.zip
  process: ChildProcess; // child process

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
      init: ["light", "init"], // command to init chain
      deamon: ["light", "start"], // command to start chain
    },
  };

  constructor(chain: string, event?: Electron.IpcMainEvent) {
    this.chain = chain;
    this.event = event;
    this.tempPath = isDev
      ? join(appRootDir.get(), "main", "binaries", "temp")
      : join(dirname(appRootDir.get()), "bin", "temp");
    this.downloadPath = isDev
      ? join(appRootDir.get(), "main", "binaries", `${this.chain}-node`)
      : join(dirname(appRootDir.get()), "bin", `${this.chain}-node`);
    this.url = this.binaries[this.chain][this.platform()][this.architecture()];
  }

  start = async (): Promise<void> => {
    try {
      if (await this.exists()) return this.runDaemon();
      await this.deleteTemp();
      await this.mkDir(this.downloadPath);
      await this.mkDir(this.tempPath);
      const zip = await this.downloadZip(this.url);
      await this.unzip(zip);
      await this.move(zip);
      await this.deleteTemp();
      const init = await this.installDaemon();
      await new Promise((resolve) => setTimeout(resolve, 5 * 1000));
      await init.kill();
      await this.runDaemon();
    } catch (error) {
      await this.deleteTemp();
      return this.reply(error);
    }
  };

  // make directory if exists
  mkDir = async (path: string) => {
    try {
      this.reply(`Creating ${path}...`);
      await fs.mkdirSync(path, { recursive: true });
    } catch (error) {
      this.reply(error.message);
    }
  };

  deleteTemp = async (): Promise<void> => {
    try {
      this.reply(`Deleting temp folder...`);
      await fs.rmSync(this.tempPath, { recursive: true });
    } catch (error) {
      this.reply(error.message);
    }
  };

  exists = async (): Promise<boolean> => {
    this.reply(`Checking if binary exists...`);
    const hasBinary = await fs.existsSync(
      join(this.downloadPath, this.binaries[this.chain].file)
    );
    return hasBinary;
  };

  move = async (zip: Electron.DownloadItem): Promise<void> => {
    this.reply(`Moving binary to ${this.downloadPath}`);
    return await fs.renameSync(
      join(zip.savePath.replace(".zip", ""), this.binaries[this.chain].file),
      join(this.downloadPath, this.binaries[this.chain].file)
    );
  };

  unzip = async (zip: Electron.DownloadItem): Promise<void> => {
    this.reply(`unzipping binary to ${this.tempPath}`);
    return await extract(zip.savePath, {
      dir: this.tempPath,
      onEntry: (entry) => {
        this.reply(JSON.stringify(entry));
      },
    });
  };

  downloadZip = async (url: string): Promise<Electron.DownloadItem> => {
    this.reply(`download binary from ${url}`);
    return await download(BrowserWindow.getFocusedWindow(), url, {
      directory: this.tempPath,
      onProgress: (progress) => {
        this.reply(JSON.stringify(progress));
      },
    });
  };

  // reply to electron console
  reply = (message: string) => {
    if (!this.event) return;
    this.event.reply("stdout", message);
  };

  installDaemon = (): ChildProcessWithoutNullStreams => {
    this.reply(`Installing daemon ${this.chain}...`);
    const init = spawn(
      join(this.downloadPath, this.binaries[this.chain].file),
      this.binaries[this.chain].init
    );
    init.stdout.on("data", (data) => this.reply(`runInit stdout: ${data}`));
    init.stderr.on("data", (error) => this.reply(`runInit stderr: ${error}`));
    return init;
  };

  runDaemon = () => {
    this.reply(`Running daemon ${this.chain}...`);
    this.process = spawn(
      join(this.downloadPath, this.binaries[this.chain].file),
      this.binaries[this.chain].deamon
    );
    this.process.stdout.on("data", (data) => this.reply(`stdout: ${data}`));
    this.process.stderr.on("data", (error) => this.reply(`stderr: ${error}`));
  };

  stop = () => {
    this.reply(`Stopping ${this.chain}...`);
    this.process.kill();
    this.deleteTemp();
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

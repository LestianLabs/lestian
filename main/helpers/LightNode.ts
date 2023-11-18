import fs from "fs";
import util from "util";
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
      cmds: ["light init --node.store", "light start --node.store"],
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
      if (await this.exists()) return this.runCmds();
      await this.deleteTemp();
      await this.mkDir(this.downloadPath);
      await this.mkDir(this.tempPath);
      const zip = await this.downloadZip(this.url);
      await this.unzip(zip);
      await this.move(zip);
      await this.deleteTemp();
      await this.runCmds();
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

  stop = async () => {
    this.reply(`Stopping ${this.chain} node...`);
    this.process.kill();
    this.deleteTemp();
  };

  // delete temp folder
  deleteTemp = async () => {
    try {
      this.reply(`Deleting temp folder...`);
      await fs.rmSync(this.tempPath, { recursive: true });
    } catch (error) {
      this.reply(error.message);
    }
  };

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
        this.reply(JSON.stringify(entry));
      },
    });
  };

  // download binary from url
  downloadZip = async (url: string): Promise<Electron.DownloadItem> => {
    this.reply(`Downloading...`);
    return await download(BrowserWindow.getFocusedWindow(), url, {
      directory: this.tempPath,
      onProgress: (progress) => {
        this.reply(JSON.stringify(progress));
      },
    });
  };

  // reply to electron console
  reply = (message: string) => {
    console.log("\nLighNode::reply", message);
    if (!this.event) return;
    this.event.reply("stdout", message);
  };

  // run commands
  runCmds = async () => {
    const exec = util.promisify(require("child_process").exec);
    for (const cmd of this.binaries[this.chain].cmds) {
      this.reply(
        `runCmd: ${join(
          this.downloadPath,
          this.binaries[this.chain].file
        )} ${cmd}`
      );
      this.process = await exec(
        `${join(this.downloadPath, this.binaries[this.chain].file)} ${cmd} ${
          this.downloadPath
        }`,
        (error, stdout, stderr) => {
          this.reply(`${this.chain} error: ${error}`);
          this.reply(`${this.chain} stderr: ${stderr}`);
          this.reply(`${this.chain} stdout: ${stdout}`);
        }
      );
      // wait 1 second
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
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

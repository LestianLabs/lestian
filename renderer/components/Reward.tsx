import React, { useState, useEffect } from "react";
import Authenticate from "./Authenticate";
import Discord from "./Discord";
import Address from "./Address";

export default function Reward() {
  const [authenticate, setAuthenticate] = useState(false);
  const [discord, setDiscord] = useState(false);
  const [address, setAddress] = useState("");
  const [verify, setVerify] = useState(false);

  useEffect(() => {
    // get initial store and set state
    getStore();

    // update realtime state from ipc.ts
    window.ipc.on("reply-store", (store) => {
      if (store[0] == "authenticate") setAuthenticate(store[1]);
      if (store[0] == "discord") setDiscord(store[1]);
      if (store[0] == "address") setAddress(store[1]);
    });

    // from deeplink.ts
    window.ipc.on("deep-link", (link: string) => {
      if (link.indexOf("?code=") === -1) return;
      window.ipc.send("set-store", ["authenticate", link.split("?code=")[1]]);
    });
  }, []);

  const getStore = async () => {
    // get electron-store from ipc.ts
    const authenticateStore = await window.ipc.invoke(
      "get-store",
      "authenticate"
    );
    const discordStore = await window.ipc.invoke("get-store", "discord");
    const addressStore = await window.ipc.invoke("get-store", "address");
    const isVerified =
      authenticateStore != undefined &&
      discordStore != undefined &&
      addressStore != undefined;

    // set state
    setAuthenticate(authenticateStore);
    setDiscord(discordStore);
    setAddress(addressStore);
    setVerify(isVerified);
  };

  return (
    <React.Fragment>
      <div aria-label="content" className="mt-9 grid gap-2.5">
        <div className="flex items-center space-x-4 p-3.5 rounded-xl bg-slate-700">
          <div className="text-sm font-small text-gray-400">
            To earn rewards, please complete below:
          </div>
        </div>
      </div>
      <Authenticate authenticate={authenticate} />
      <Discord discord={discord} />
      <Address address={address} />
    </React.Fragment>
  );
}

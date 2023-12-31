import React, { useState, useEffect } from "react";
import Image from "next/image";
import Nodes from "../components/Nodes";
import Reward from "./Reward";

export default function Nav() {
  const tabs = [
    { name: "Node", component: <Nodes /> },
    { name: "Reward", component: <Reward /> },
  ];
  const [tab, setTab] = useState(0);

  useEffect(() => {
    // from deeplink.ts
    window.ipc.on("deep-link", (discordCode) => {
      setTab(1);
    });
  });

  return (
    <React.Fragment>
      <div>
        <div aria-label="header" className="flex items-center space-x-3">
          <Image src="/images/logo.svg" width={32} height={32} />
          {tabs.map((_, index) => (
            <div
              key={index}
              onClick={() => setTab(index)}
              className={`text-gray-400 cursor-pointer  ${
                tab == index ? "border-b border-gray-400" : ""
              }`}
            >
              {tabs[index].name}
            </div>
          ))}
        </div>
      </div>

      {tabs.map((_, index) => (
        <div key={index} className={`${tab == index ? "block" : "hidden"}`}>
          {tabs[index].component}
        </div>
      ))}
    </React.Fragment>
  );
}

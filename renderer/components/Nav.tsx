import React, { useState } from "react";
import Image from "next/image";
import Nodes from "../components/Nodes";
import Wallet from "../components/Wallet";
import Logs from "../components/Logs";

export default function Nav() {
  const tabs = [
    { name: "Node", component: <Nodes /> },
    { name: "Wallet", component: <Wallet /> },
    { name: "Logs", component: <Logs /> },
  ];
  const [tab, setTab] = useState(0);

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

import React from "react";
import Image from "next/image";

export default function Nav() {
  const signout = () => {
    console.log("signout");
  };
  return (
    <React.Fragment>
      <div>
        <div aria-label="header" className="flex items-center space-x-3">
          <Image src="/images/logo.svg" width={32} height={32} />
          <div className="space-y-0.5 flex-1">
            <h3 className="font-medium text-lg tracking-tight text-gray-300 leading-tight">
              Lestian
            </h3>
            <p className="highlight text-xs font-normal text-gray-400 leading-none">
              v1.0.0
            </p>
          </div>
          <a
            href="/node"
            className="hover:bg-emerald-400 duration-200  inline-flex items-center shrink-0 justify-center w-8 h-8 rounded-full text-white bg-gray-900 focus:outline-none"
          >
            <Image src="/images/node.svg" width={32} height={32} />
          </a>
          <a
            href="/wallet"
            className="hover:bg-emerald-400 duration-200  inline-flex items-center shrink-0 justify-center w-8 h-8 rounded-full text-white bg-gray-900 focus:outline-none"
          >
            <Image src="/images/wallet.svg" width={32} height={32} />
          </a>
          <div
            onClick={() => signout()}
            className="cursor-pointer hover:bg-red-400 duration-200 inline-flex items-center shrink-0 justify-center w-8 h-8 rounded-full text-white bg-gray-900 focus:outline-none"
          >
            <Image src="/images/logout.svg" width={32} height={32} />
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

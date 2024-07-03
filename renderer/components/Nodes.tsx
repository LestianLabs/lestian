import React from "react";
import Toggle from "./Toggle";
import Image from "next/image";
import chains from "../../main/helpers/chains.json";

export default function Nodes() {
  return (
    <React.Fragment>
      <div aria-label="content" className="mt-9 grid gap-2.5">
        <div className="flex items-center space-x-4 p-3.5 rounded-xl bg-slate-700">
          <span className="flex items-center justify-center w-10 h-10 shrink-0 rounded-full text-gray-900">
            <Image src="/images/avail.png" width={48} height={48} />
          </span>
          <div className="flex flex-col flex-1">
            <h3 className="text-sm font-medium text-gray-100">
              Avail
            </h3>
            <div className="divide-x divide-gray-200 mt-auto">
              <span className="inline-block px-3 text-xs leading-none text-gray-400 font-normal first:pl-0">
                v{chains.avail.version}
              </span>
            </div>
          </div>
          <Toggle chain="avail" />
        </div>
        <div className="flex items-center space-x-4 p-3.5 rounded-xl bg-slate-700">
          <span className="flex items-center justify-center w-10 h-10 shrink-0 rounded-full text-gray-900">
            <Image src="/images/celestia.png" width={48} height={48} />
          </span>
          <div className="flex flex-col flex-1">
            <h3 className="text-sm font-medium text-gray-100">
              Celestia
            </h3>
            <div className="divide-x divide-gray-200 mt-auto">
              <span className="inline-block px-3 text-xs leading-none text-gray-400 font-normal first:pl-0">
                v{chains.celestia.version}
              </span>
            </div>
          </div>
          <Toggle chain="celestia" />
        </div>
      </div>
    </React.Fragment>
  );
}

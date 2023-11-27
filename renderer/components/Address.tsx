import React, { useState } from "react";
import { isAddress } from "viem";

interface Props {
  address: string;
}

export default function Address(props: Props) {
  const { address } = props;
  const [value, setValue] = useState("");

  const handleSave = async () => {
    // check if value is address
    if (!isAddress(value)) return alert("Invalid Address");
    // save address, will trigger ipc.ts then Reward.ts to rerender
    window.ipc.send("set-store", ["address", value]);
  };

  return (
    <div aria-label="content" className="mt-2 grid gap-2.5">
      <div className="flex items-center space-x-4 p-3.5 rounded-xl bg-slate-700">
        <span className="flex items-center justify-center w-10 h-10 shrink-0 rounded-full text-gray-900">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="#cbd5e1"
            className="bi bi-discord"
            viewBox="0 0 16 16"
          >
            <path d="M8.277.084a.5.5 0 0 0-.554 0l-7.5 5A.5.5 0 0 0 .5 6h1.875v7H1.5a.5.5 0 0 0 0 1h13a.5.5 0 1 0 0-1h-.875V6H15.5a.5.5 0 0 0 .277-.916l-7.5-5zM12.375 6v7h-1.25V6zm-2.5 0v7h-1.25V6zm-2.5 0v7h-1.25V6zm-2.5 0v7h-1.25V6zM8 4a1 1 0 1 1 0-2 1 1 0 0 1 0 2M.5 15a.5.5 0 0 0 0 1h15a.5.5 0 1 0 0-1z" />
          </svg>
        </span>
        <div className="flex flex-col flex-1">
          {address === "" ? (
            <input
              className="bg-slate-600 rounded-xl text-gray-100 pl-2 pt-2 pb-2"
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="0xAddress"
            ></input>
          ) : (
            <div className="text-sm font-medium text-gray-300">
              {address.slice(0, 5) + "..." + address.slice(-5)}
            </div>
          )}
        </div>
        {address === "" ? (
          <button
            type="button"
            className="rounded-full bg-red-400 px-1 py-1 hover:bg-red-500"
            onClick={() => handleSave()}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="white"
              viewBox="0 0 16 16"
            >
              <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8" />
            </svg>
          </button>
        ) : (
          <button
            type="button"
            className="rounded-full bg-emerald-400 px-1 py-1"
            disabled
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="white"
              viewBox="0 0 16 16"
            >
              <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

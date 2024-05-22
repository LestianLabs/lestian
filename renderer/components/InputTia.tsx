import React, { useEffect, useState } from "react";

export default function InputTia() {
  const key = "tiaAddress";
  const [value, setValue] = useState("");
  const [savedValue, setSavedValue] = useState("");

  useEffect(() => {
    // get initial store and set state
    getStore();
    // update realtime state from ipc.ts
    window.ipc.on("reply-store", (store) => {
      if (store[0] == key) setSavedValue(store[1]);
    });
  }, []);

  const getStore = async () => {
    const valStore = await window.ipc.invoke("get-store", key);
    setSavedValue(valStore);
  };

  const deleteStore = async () => {
    if (!confirm("Are you sure you want sign out?")) return;
    // delete, will trigger ipc.ts then reply-store to rerender
    window.ipc.send("delete-store", key);
  };

  const handleSave = async () => {
    if (!value) return alert("Invalid TIA Address");
    if (value.length !== 47 || value.indexOf("celestia") !== 0)
      return alert("Invalid TIA Address");
    if (await valueExists()) return alert("Address is taken");
    if (!confirm("Address is immutable. Continue?")) return;
    // save, will trigger ipc.ts then reply-store to rerender
    window.ipc.send("set-store", [key, value]);
  };

  const valueExists = async () => {
    const url = `http://auth.lestian.com/user?id=${value}`;
    const { data } = await window.ipc.invoke("fetch", url);
    return data.length > 0;
  };

  return (
    <div aria-label="content" className="mt-2 grid gap-2.5">
      <div className="flex items-center space-x-4 p-3.5 rounded-xl bg-slate-700">
        <div className="flex flex-col flex-1">
          {savedValue ? (
            <div className="text-sm font-medium text-gray-300">
              {savedValue.slice(0, 20) + "..." + savedValue.slice(-5)}
            </div>
          ) : (
            <input
              className="bg-slate-600 rounded-xl text-gray-100 pl-2 pt-2 pb-2"
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="celestia1pxyxlhfxj88hd75"
            ></input>
          )}
        </div>
        {savedValue ? (
          <button
            type="button"
            className="rounded-full bg-emerald-400 px-1 py-1"
            disabled={false}
            onClick={() => deleteStore()}
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
        ) : (
          <button
            type="button"
            className="rounded-full bg-red-400 px-1 py-1 hover:bg-emerald-400"
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
        )}
      </div>
    </div>
  );
}

import React from "react";

export default function Titlebar() {
  const handleClose = async () => window.ipc.send("close", null);
  const handleMinimize = async () => window.ipc.send("minimize", null);
  return (
    <>
      <div className="titlebar fixed top-0 left-14 right-0 bg-red-700 h-8">
        drag move bar
      </div>
      <div className="fixed top-0 left-0 right-0 bg-slate-800 h-8 z-10"></div>
      <svg
        onClick={() => handleClose()}
        className="fixed cursor-pointer left-4 z-10"
        height="32"
        width="12"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle r="6" cx="6" cy="16" fill="#ff5f57" />
      </svg>
      <svg
        onClick={() => handleMinimize()}
        className="fixed cursor-pointer left-9 z-10"
        height="32"
        width="12"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle r="6" cx="6" cy="16" fill="#febc2e" />
      </svg>
      <svg
        className="fixed cursor-pointer left-14 z-10"
        height="32"
        width="12"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle r="6" cx="6" cy="16" fill="#504a56" />
      </svg>
    </>
  );
}

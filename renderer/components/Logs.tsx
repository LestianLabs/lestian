import React, { useState, useEffect } from "react";

export default function Logs() {
  const [logs, setLogs] = useState("logs from node will display here");

  useEffect(() => {
    // get logs from LightNode.ts::reply
    window.ipc.on("stdout", (stdout) => {
      setLogs(stdout.toString());
    });
  }, []);

  return (
    <React.Fragment>
      <div aria-label="content" className="mt-9 grid gap-2.5">
        <div className="flex items-center space-x-4 p-3.5 rounded-lg text-slate-300 text-xs">
          <code>{logs}</code>
        </div>
        <div>
          <div
            onClick={() => window.ipc.send("clipboard", logs)}
            className="cursor-pointer hover:bg-sky-700 transform active:scale-75 transition-transform inline-flex items-center shrink-0 justify-center w-8 h-8 rounded-full text-white bg-slate-600 focus:outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75"
              />
            </svg>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

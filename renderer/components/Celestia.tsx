import { useState } from "react";

export default function Celestia() {
  const [nodeRunning, setNodeRunning] = useState(false);

  const handleNode = () => {
    // toggle node in main/background.ts
    window.ipc.send("celestia", !nodeRunning);

    // display stdout from node in console
    window.ipc.on("message", (stdout) => {
      console.log(stdout);
    });

    // update button text
    setNodeRunning(!nodeRunning);
  };

  return (
    <button className="btn-blue" onClick={() => handleNode()}>
      {nodeRunning ? "Stop Celestia Node" : "Run Celestia Node"}
    </button>
  );
}

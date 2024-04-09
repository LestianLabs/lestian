import React from "react";

export default function Question() {
  const handleClick = () => {
    window.ipc.send("open-external", "https://linktr.ee/lestian");
  };

  return (
    <button type="button" onClick={() => handleClick()} title="Documentation">
      <div className="text-white">?</div>
    </button>
  );
}

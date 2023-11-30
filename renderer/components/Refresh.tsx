import React, { useState } from "react";

export default function Refresh() {
  const [animated, setAnimated] = useState(false);

  const handleClick = async () => {
    animate();
    console.log("refresh");
  };

  const animate = () => {
    setAnimated(true);
    setTimeout(() => {
      setAnimated(false);
    }, 1000);
  };

  return (
    <button
      type="button"
      className={animated ? "animate-spin" : ""}
      onClick={() => handleClick()}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        fill="white"
        viewBox="0 0 16 16"
      >
        <path
          fillRule="evenodd"
          d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2z"
        />
        <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466" />{" "}
      </svg>
    </button>
  );
}

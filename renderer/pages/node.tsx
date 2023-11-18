import React from "react";
import Nav from "../components/Nav";

export default function Nodes() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-900">
      <div className="p-8 rounded-2xl bg-slate-800 max-w-sm w-full min-h-[300px] my-10">
        <Nav />
      </div>
    </div>
  );
}

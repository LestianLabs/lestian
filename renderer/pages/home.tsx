import React from "react";
import Titlebar from "../components/Titlebar";
import Nav from "../components/Nav";

export default function Nodes() {
  return (
    <>
      <Titlebar />
      <div className="flex items-center justify-center min-h-screen bg-slate-900">
        <div className="p-8 rounded-xl bg-slate-800 max-w-sm w-full min-h-[540px] mt-9">
          <Nav />
        </div>
      </div>
    </>
  );
}

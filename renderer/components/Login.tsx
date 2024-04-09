import React from "react";
import InputUser from "./InputUser";
import InputEth from "./InputEth";
import InputTia from "./InputTia";
import Question from "./Question";

export default function Login() {
  return (
    <React.Fragment>
      <div aria-label="content" className="mt-9 grid gap-2.5">
        <div className="flex items-center space-x-4 p-3.5 rounded-xl bg-slate-700">
          <div className="text-sm font-small text-gray-400">
            Please fill all for rewards
          </div>
        </div>
      </div>
      <InputUser />
      <InputEth />
      <InputTia />
      <div className="mt-10 flex flex-row justify-between">
        <Question />
      </div>
    </React.Fragment>
  );
}

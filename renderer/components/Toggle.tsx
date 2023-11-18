import { useState, useEffect } from "react";
import { Switch } from "@headlessui/react";

interface Props {
  chain: string;
}

export default function Toggle(props: Props) {
  const { chain } = props;
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    console.log("toggle.tsx", chain, enabled);
    enabled
      ? window.ipc.send("start-node", chain)
      : window.ipc.send("stop-node", chain);
  }, [enabled]);

  const classNames = (...classes) => {
    return classes.filter(Boolean).join(" ");
  };

  return (
    <Switch
      checked={enabled}
      onChange={setEnabled}
      className={classNames(
        enabled ? "bg-emerald-400" : "bg-red-400",
        "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none"
      )}
    >
      <span className="sr-only">Use setting</span>
      <span
        className={classNames(
          enabled ? "translate-x-5" : "translate-x-0",
          "pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
        )}
      ></span>
    </Switch>
  );
}

import React from "react";
import Link from "next/link";

export default function Home() {
  return (
    <React.Fragment>
      <div className="flex items-center justify-center min-h-screen bg-slate-900">
        <Link href="/node">
          <a className="btn-blue text-white">Sign In</a>
        </Link>
      </div>
    </React.Fragment>
  );
}

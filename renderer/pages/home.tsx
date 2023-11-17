import React from "react";
import Link from "next/link";

export default function Home() {
  return (
    <React.Fragment>
      <div className="mt-1 w-full flex-wrap flex justify-center min-h-99">
        <Link href="/node">
          <a className="btn-blue">Sign In</a>
        </Link>
      </div>
    </React.Fragment>
  );
}

import React from "react";
import Head from "next/head";
import Link from "next/link";

export default function Home() {
  return (
    <React.Fragment>
      <Head>
        <title>Lestian</title>
      </Head>
      <div className="mt-1 w-full flex-wrap flex justify-center">
        <Link href="/node">
          <a className="btn-blue">Sign In</a>
        </Link>
      </div>
    </React.Fragment>
  );
}

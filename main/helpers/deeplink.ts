import { app } from "electron";
import isDev from "electron-is-dev";
import { Deeplink } from "electron-deeplink";
import Store from "electron-store";

const deeplink = new Deeplink({
  app,
  mainWindow: null,
  protocol: "lestian",
  isDev,
});

// handle deep links
deeplink.on("received", (link: string) => {
  const store = new Store();
  // save discordOauthToken: lestian://open?discordOAuthToken=token123
  store.set(
    "discordOAuthToken",
    new URL(link).searchParams.get("discordOAuthToken")
  );
  console.log("DEEP LINK AUTH TOKEN", store.get("discordOAuthToken"));
});

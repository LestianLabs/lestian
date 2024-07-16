/** @type {import('next').NextConfig} */
// https://github.com/saltyshiomix/nextron?tab=readme-ov-file#nextconfigjs
module.exports = {
  output: "export",

  distDir:
    process.env.NODE_ENV === "production"
      ? // we want to change `distDir` to "../app" so as nextron can build the app in production mode!
        "../app"
      : // default `distDir` value
        ".next",

  // e.g. home.html => home/index.html
  trailingSlash: true,

  // we need to disable image optimization, because it is not compatible with `{ output: 'export' }`
  images: {
    unoptimized: true,
  },

  // webpack config for next.js
  webpack: (config) => {
    return config;
  },
};

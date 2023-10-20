/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,

  transpilePackages: ["@transcendence/db"],
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    config.externals.push({
      "utf-8-validate": "commonjs utf-8-validate",
      bufferutil: "commonjs bufferutil",
    });
    return config;
  },

  // headers: () => [
  //   {
  //     source: "/game-chat/:friendId",
  //     headers: [
  //       {
  //         key: "Cache-Control",
  //         value: "no-store, max-age=0",
  //       },
  //     ],
  //   },
  //   {
  //     source: "/api/auth/refresh-tokens",
  //     headers: [
  //       {
  //         key: "Cache-Control",
  //         value: "no-store, max-age=0",
  //       },
  //     ],
  //   },
  // ],
};

module.exports = nextConfig;

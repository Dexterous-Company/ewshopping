// module.exports = {
//   apps: [
//     {
//       name: "ewshopping",
//       script: "node_modules/next/dist/bin/next",
//       args: "start -p 4000",
//       cwd: "/home/ewshopping-testwebsite/htdocs/testwebsite.ewshopping.com",
//       env: {
//         NODE_ENV: "production"
//       }
//     }
//   ]
// };

// module.exports = {
//   apps: [
//     {
//       name: "ewshopping-test",
//       cwd: "/home/ewshopping-testwebsite/htdocs/testwebsite.ewshopping.com",

//       script: "npm",
//       args: "start",

//       env: {
//         NODE_ENV: "production",
//         PORT: 4000
//       },

//       exec_mode: "fork",
//       instances: 1,

//       autorestart: true,
//       watch: false,

//       max_memory_restart: "2G"
//     }
//   ]
// };

module.exports = {
  apps: [
    {
      name: "ewshopping",
      cwd: "/home/ewshopping/htdocs/ewshopping.com",

      script: "npm",
      args: "start",

      env: {
        NODE_ENV: "production",
        PORT: 8000,
      },

      exec_mode: "fork",
      instances: 1,

      autorestart: true,
      watch: false,

      max_memory_restart: "2G",
    },
  ],
};

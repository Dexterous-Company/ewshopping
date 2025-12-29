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

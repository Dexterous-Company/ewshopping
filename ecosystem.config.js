module.exports = {
  apps: [
    {
      name: "ewshopping",
      script: "npm",
      args: "start",
      cwd: "/home/ewshoppingnew/htdocs/ewshopping.com",
      env: {
        NODE_ENV: "production",
        PORT: 8000,
      },
    },
  ],
};

module.exports = {
  apps : [{
    name   : "jiffer-backend",
    script : "./dist/index.js",
    env_production: {
      instances: "max",
      exec_mode: "cluster",
      autorestart: true,
      NODE_ENV: "production"
    },
    env_development: {
      instances: -1,
      watch: [
        "./dist/*"
      ],
      NODE_ENV: "development"
    }
  }]
}

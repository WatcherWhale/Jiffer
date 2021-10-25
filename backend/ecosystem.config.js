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
      instances: 1,
      watch: [
        "./dist/*"
      ],
      NODE_ENV: "development"
    }
  }],
  deploy: {
    production: {
      "user": "ec2-user",
      "host": "54.161.133.243",
      "ref" : "origin/ec2",
      "repo": "git@github.com:WatcherWhale/ict-arch.git",
      "path": "/home/ec2-user/jiffer",
      "post-deploy" : "cd backend && npm install"
    }
  }
}

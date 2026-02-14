module.exports = {
  apps: [{
    name: 'biblioteca',
    script: 'node_modules/next/dist/bin/next',
    args: 'start',
    cwd: '/home/pi/Desktop/biblioteca/logFront',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/pm2-error.log',
    out_file: './logs/pm2-out.log',
    time: true
  }]
}
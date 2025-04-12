// pm2.sensor-api.config.js
module.exports = {
    apps: [{
        name: "sensor-api",
        script: "npm",
        args: "start",
        cwd: __dirname,

        // Gestion des logs
        log_date_format: "YYYY-MM-DD HH:mm:ss",
        error_file: "./logs/pm2.error.log",
        out_file: "./logs/pm2.output.log",
        combine_logs: true,
        time: true,

        // Configuration réseau
        env: {
            NODE_ENV: "production",
            FASTIFY_ADDRESS: "0.0.0.0",  // Écoute sur toutes les interfaces
            FASTIFY_PORT: process.env.PORT || 3000,          // Port d'écoute
            DATABASE_URL: process.env.DATABASE_URL
        },

        // Gestion de la mémoire et CPU
        max_memory_restart: "800M",    // Redémarre si > 800MB
        node_args: "--max-old-space-size=1024",  // 1GB de heap max
        exec_mode: "fork",             // Mode fork pour meilleure stabilité
        instances: 1,                  // Nombre d'instances
        kill_timeout: 5000,            // Délai avant kill forcé

        // Monitoring
        min_uptime: "60s",             // Minimum avant considération "stable"
        listen_timeout: 5000,          // Timeout pour le reload
        wait_ready: true,              // Attend le signal "ready"

        // Politique de redémarrage
        autorestart: true,
        restart_delay: 1000,
        max_restarts: 10
    }]
}
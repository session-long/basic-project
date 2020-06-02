const proxy = require('http-proxy-middleware');
module.exports = function (app) {
    app.use(proxy('/api', {
        target: 'http://192.168.1.249:9501',
        // target: 'http://192.168.1.20:9501',
        changeOrigin: true,
        pathRewrite: { '^/api': '/aici-service' },
    }));
};

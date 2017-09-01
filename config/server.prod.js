
// this config for testing the prod\ppe bundle locally
// doesn't implement hot loader, so DON'T USE this for DEVELOPMENT
// -----------------------Steps to run-------------------------------
// git clean -xdf
// npm install
// npm run build:ppe (or prod)
// ./node_modules/.bin/webpack-dev-server --config .\config\server.prod.js

const fs = require("fs");
module.exports = {
    entry: "./index.html",
    devServer: {
        clientLogLevel: "none",
        https: {
            key: fs.readFileSync("config/cert/localhost.pem"),
            cert: fs.readFileSync("config/cert/localhost.pem"),
            ca: fs.readFileSync("config/cert/localhost.pem")
        },
        inline: true,
        port: 44326,
        historyApiFallback: true,
        publicPath: "/dist",
        disableHostCheck: true,
        stats: {
            colors: true,
            chunks: false
        }
    },
    module: {
        loaders: [
            { test: /\.html$/, use: "html-loader" },
        ]
    },
    resolve: {
        extensions: ["*", ".js", ".html"]
    },
}
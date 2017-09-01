var webpack = require("webpack");
const path = require("path");

const dependencies = () => {
    const deps = Object.keys(require("../package.json").dependencies);
    const result = [];
    for (const dep of deps) {
        if (dep.indexOf("@types") < 0) {
            result.push(dep);
        }
    }

    return result;
}

module.exports = {
    entry: {
        vendor: dependencies(),
    },
    devtool: "source-map",
    output: {
        path: path.resolve(__dirname, "../dist"),
        filename: "[name].bundle.js",
        library: "[name]",
    },
    plugins: [
        new webpack.DllPlugin({
            path: path.join(__dirname, "../dist", "[name]-manifest.json"),
            name: "[name]"
        }),
    ],
    resolve: {
        modules: [
            "node_modules"
        ]
    }
}
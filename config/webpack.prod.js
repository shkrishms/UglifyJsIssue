const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const path = require("path");
const pkg = require("../package.json");
const settings = require("./app.settings");

const extractLess = new ExtractTextPlugin({
    filename: "[name].[contenthash].css",
    allChunks: true,
    disable: process.env.NODE_ENV === "development"
});

const appSetting = process.env.AppSetting;
module.exports = {
    entry: {
        common1: ["react", "react-dom", "react-router-dom"],
        common2: ["highcharts"],
        common3: ["mobx", "mobx-react"],
        common4: ["semantic-ui-react"],
        ospapp: "./src/index.tsx",
    },
    output: {
        path: path.resolve(__dirname, "../dist"),
        filename: "[name].bundle.[chunkhash].js",
        chunkFilename: "[name].[chunkhash].chunk.js",
        publicPath: "/dist/"
    },
    devtool: "source-map",
    module: {
        rules: [
            {
                test: /\.ts(x?)$/,
                exclude: /(node_modules|tests|src\/Stores\/__mocks__)/,
                use: [
                    { loader: "babel-loader" },
                    {
                        loader: "ts-loader",
                        options: {
                            // disable type checker 
                            transpileOnly: true
                        }
                    },

                ]
            },
            {
                test: /\.js$/,
                exclude: /(node_modules|tests|src\/Stores\/__mocks__)/,
                use: [{ loader: "babel-loader" }]
            },
            {
                test: /\.(less|css)$/,
                exclude: /\.module.(less|css)$/,
                use: extractLess.extract({
                    fallback: "style-loader",
                    use: [
                        { loader: "css-loader" },
                        { loader: "less-loader" }
                    ]
                })
            },
            {
                test: /\.module.(less|css)$/,
                use: extractLess.extract({
                    fallback: "style-loader",
                    use: [
                        {
                            loader: "css-loader",
                            options: { modules: true, localIdentName: "[hash:base64:8]" }
                        },
                        { loader: "less-loader" }
                    ]
                })
            }
        ],
    },
    plugins: [
        new ForkTsCheckerWebpackPlugin({
            tslint: false,
            workers: 2
        }),
        new webpack.optimize.CommonsChunkPlugin({
            names: ["common1", "common2", "common3", "common4", "manifest"],
        }),
        new webpack.DefinePlugin(settings[appSetting]),
        extractLess,
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            },
            sourceMap: false
        }),
        // turn this on if you want to analyze the bundle
        // new BundleAnalyzerPlugin(),
        new HtmlWebpackPlugin({
            filename: "../index.html",
            template: "./config/template.html"
        }),
    ],
    resolve: {
        extensions: ["*", ".ts", ".tsx", ".js", ".jsx", ".less", ".css"]
    }
}

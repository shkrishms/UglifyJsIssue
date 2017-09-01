var gulp = require("gulp");
// Useful for debugging Gulp pipes, un-comment 
// whenever you need to debug
// var debug = require("gulp-debug");
var gutil = require("gulp-util");
var webpack = require("webpack");
var sourcemaps = require("gulp-sourcemaps");
var less = require("gulp-less");
var concat = require("gulp-concat");
var gulpTslint = require("gulp-tslint");
var tslint = require("tslint");
var cleanCSS = require("gulp-clean-css");
var del = require("del");
var path = require("path");
var zip = require("gulp-zip");
var merge2 = require('merge2');

var paths = {
    source: {
        lintFiles: ["./src/**/*.tsx", "./src/**/*.ts", "!./src/Services/*.ts", "!./src/**/*.d.ts"],
        cssLintFiles: ["./src/**/*.less"],
        semantic: ["./node_modules/semantic-ui-less/**/*", "./theme/**/*", "!./node_modules/semantic-ui-less/**/*.js"],
        semanticRoot: "tmp/ospCss/semantic.less",
        cleanUpFolders: ["dist", "tmp", "bin", "obj", "release"],
        packageFiles: ["./index.html", "./web.config", "./dist/**"],
        fonts: ["node_modules/semantic-ui-less/themes/default/assets/fonts/*"],
        images: ["./images/**"],
        officeFabric: "./node_modules/office-ui-fabric-react/dist/css/fabric.css",
        reactDatetime: "./node_modules/react-datetime/css/react-datetime.css",
        introjs: "./node_modules/intro.js/introjs.css"
    },
    dest: {
        semantic: "tmp/ospCss",
        styles: "dist/styles",
        release: "./release",
        images: "dist/images",
        fonts: "dist/fonts"
    },
    config: {
        webpackVendor: "./config/webpack.vendor-bundle.js",
        webpackDev: "./config/webpack.dev.js",
        webpackProd: "./config/webpack.Prod.js",
        packageName: "deploy.zip"
    }
};

var configFile = process.env.webpackConfig === "prod" ? paths.config.webpackProd : paths.config.webpackDev;

const runWebpack = (file) => {
    console.log("---------------------------------------------------------------------");
    console.log("Building using following webpack config ", file);
    console.log("---------------------------------------------------------------------");
    var webpackConfig = require(file);
    var myConfig = Object.create(webpackConfig);

    webpack(myConfig)
        .run(function (err, stats) {
            gutil.log("[tsbuild]",
                stats.toString({
                    colors: true,
                    chunks: false,
                }));

            if (err) {
                throw new gutil.PluginError("tsbuild", err)
            }

            if (stats.hasErrors()) {
                throw new gutil.PluginError("tsbuild", "Gulp task failed..");
            }
        });
}

gulp.task("tsbuild-vendor", () => {
    if (process.env.webpackConfig !== "prod") {
        runWebpack(paths.config.webpackVendor);
    }
})

gulp.task("tsbuild", ["lint", "lint-css", "tsbuild-vendor"], () => {
    runWebpack(configFile);
});

gulp.task("lint",
    function () {
        console.log("---------------------------------------------------------------------");
        console.log("Running tslint");
        console.log("---------------------------------------------------------------------");

        var program = tslint.Linter.createProgram("./tsconfig.json");
        return gulp.src(paths.source.lintFiles, {
            base: "."
        })
            // .pipe(debug())
            .pipe(gulpTslint({
                formatter: "stylish",
                configuration: "tslint.json",
                program: program
            }))
            .pipe(gulpTslint.report({
                summarizeFailureOutput: true
            }));
    });

gulp.task('lint-css', function lintCssTask() {
    const gulpStylelint = require('gulp-stylelint');

    return gulp
        .src(paths.source.cssLintFiles)
        .pipe(gulpStylelint({
            configFile: './config/stylelint.stylelintrc.json',
            failAfterError: true,
            reporters: [
                { formatter: 'string', console: true }
            ]
        }));
});

gulp.task("copy-semantic-files",
    function () {
        return gulp.src(paths.source.semantic)
            .pipe(gulp.dest(paths.dest.semantic));
    });

gulp.task("copy-fonts",
    function () {
        gulp.src(paths.source.fonts)
            .pipe(gulp.dest(paths.dest.fonts));
    });

gulp.task("copy-images",
    function () {
        gulp.src(paths.source.images)
            .pipe(gulp.dest(paths.dest.images));
    });

gulp.task("default-styles", ["copy-semantic-files"],
    function () {
        var lessStream = gulp.src(paths.source.semanticRoot, {
            base: "."
        })
            // .pipe(sourcemaps.init())
            .pipe(less());

        var cssStream = gulp.src(paths.source.officeFabric);
        var datetimeStream = gulp.src(paths.source.reactDatetime);
        var introjsStream = gulp.src(paths.source.introjs);

        return merge2(cssStream, datetimeStream, introjsStream, lessStream)
            .pipe(concat("ospapp.default.css"))
            .pipe(cleanCSS({
                keepSpecialComments: 0
            }))
            //.pipe(sourcemaps.write())
            .pipe(gulp.dest(paths.dest.styles));
    });

gulp.task("clean",
    function () {
        return del(["dist", "tmp", "bin", "obj", "release"]);
    });

gulp.task("watch:lint",
    function () {
        gulp.watch(paths.source.lintFiles, ["lint"]);
        gulp.watch(paths.source.cssLintFiles, ["lint-css"]);
    });

gulp.task("watch:theme",
    function () {
        gulp.watch(paths.source.semantic, ["default-styles"]);
    });

gulp.task("package",
    function () {
        return gulp.src(paths.source.packageFiles, {
            base: "."
        })
            .pipe(zip(paths.config.packageName))
            .pipe(gulp.dest(paths.dest.release));
    });

gulp.task("default", ["default-styles", "copy-images", "copy-fonts", "tsbuild"]);

const path = require("path");
const serverless = require("serverless-webpack");
const rimraf = require("rimraf");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

const SpeedMeasurePluginObject = new SpeedMeasurePlugin();

const IS_LOCAL = serverless.lib.webpack.isLocal;
module.exports = (async () => {
    return SpeedMeasurePluginObject.wrap({
        // `mode` will be set to `production` and comes with included optimizations
        // when building to be run on AWS or similar.
        // https://webpack.js.org/configuration/mode/
        // mode: IS_LOCAL ? "development" : "production",
        // mode: "development",

        // to determine what source maps to use per dev or prod
        // https://webpack.js.org/configuration/devtool/
        // devtool: IS_LOCAL ? "source-map" : "nosources-source-map",
        devtool: "source-map",

        // the provided argument will be an object referencing functions as defined
        // in your `serverless.yml` .
        // https://webpack.js.org/concepts/entry-points/
        entry: serverless.lib.entries,

        target: "node",
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    loader: "ts-loader",
                    exclude: [ /node_modules/, /post-deploy/ ],
                }
            ],
        },
        optimization: {
            splitChunks: {
                chunks: "all",
            },
            usedExports: true,
            sideEffects: true,
            // innerGraph: true,
            minimize: true, //serverless.lib.webpack.isLocal,
            minimizer: [ new TerserPlugin({
                // exclude: /node_modules[\\/]@aws-sdk/i,
                terserOptions: {
                    compress: { defaults: false, unused: true },
                    mangle: false,   
                }
            }) ],
        },
        resolve: {
            plugins: [ new TsconfigPathsPlugin() ],
            // What file extensions we want Webpack to care about, and in what order
            extensions: [ ".tsx", ".ts", ".js" ],
        },
        output: {
            libraryTarget: "commonjs2",
            path: path.join(__dirname, "dist"),
            // filename: 'app.js',
            filename: "[name].js",
            sourceMapFilename: "[file].map",
        },
        performance: {
            // Turn off size warnings for entry points
            hints: false,
        },
        plugins: [
            new (class {
                apply (compiler) {
                    compiler.hooks.done.tap("Remove LICENSE", () => {
                        console.log("Remove LICENSE.txt");
                        rimraf.sync("./dist/*.LICENSE.txt");
                    });
                }
            })(),
            new BundleAnalyzerPlugin({ analyzerMode: "static" }),
        ],
        // Remove externals because we need them while tree-shaking.
        // externals: [nodeExternals()],
        externals: [ "aws-sdk", "@aws-sdk", "@aws-sdk/*" ]
        // externals: [ { "@aws-sdk/*": "commonjs @aws-sdk/*" } ] ,
    });
})();

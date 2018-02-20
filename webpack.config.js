// project settings
const themename = 'KickstartWebpack';

// path settings
const source = [
    __dirname + '/assets/' + themename + '/scripts/theme.js',
    __dirname + '/assets/' + themename + '/styles/theme.scss'
];
const images = [
    __dirname + '/assets/' + themename + '/images'
];
const fonts = [
    __dirname + '/assets/' + themename + '/fonts'
];
const target = __dirname + '/themes/Frontend/' + themename + '/frontend/_public/dist';
const nodeModules = __dirname + '/node_modules';

// require Plugins
const fs = require('fs');
const path = require('path');
const {NoEmitOnErrorsPlugin, SourceMapDevToolPlugin} = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const ConcatPlugin = require('webpack-concat-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const ProvidePlugin = require('webpack').ProvidePlugin;
const autoprefixer = require('autoprefixer');
const postcssUrl = require('postcss-url');
const cssnano = require('cssnano');
const realNodeModules = fs.realpathSync(nodeModules);
//const genDirNodeModules = path.join(process.cwd(), 'src', '$$_gendir', 'node_modules');

// environment settings
const PROD = JSON.parse(process.env.PROD_ENV || '0');
const minimizeCss = PROD;

// postcss settings
const postcssPlugins = function () {
    // safe settings based on: https://github.com/ben-eb/cssnano/issues/358#issuecomment-283696193
    const importantCommentRe = /@preserve|@license|[@#]\s*source(?:Mapping)?URL|^!/i;
    const minimizeOptions = {
        autoprefixer: false,
        safe: true,
        mergeLonghand: false,
        discardComments: {remove: (comment) => !importantCommentRe.test(comment)}
    };
    return [
        postcssUrl({
            url: (URL) => {
                if ('url' in URL) {
                    URL = URL.url;
                }
                // Only convert root relative URLs, which CSS-Loader won't process into require().
                if (!URL.startsWith('/') || URL.startsWith('//')) {
                    return URL;
                }
                if (deployUrl.match(/:\/\//)) {
                    // If deployUrl contains a scheme, ignore baseHref use deployUrl as is.
                    return `${deployUrl.replace(/\/$/, '')}${URL}`;
                }
                else if (baseHref.match(/:\/\//)) {
                    // If baseHref contains a scheme, include it as is.
                    return baseHref.replace(/\/$/, '') +
                        `/${deployUrl}/${URL}`.replace(/\/\/+/g, '/');
                }
                else {
                    // Join together base-href, deploy-url and the original URL.
                    // Also dedupe multiple slashes into single ones.
                    return `/${baseHref}/${deployUrl}/${URL}`.replace(/\/\/+/g, '/');
                }
            }
        }),
        autoprefixer(),
    ].concat(minimizeCss ? [cssnano(minimizeOptions)] : []);
};

module.exports = {
    watchOptions: {
        poll: 400,
        aggregateTimeout: 100
    },
    resolve: {
        extensions: [
            '.ts',
            '.js'
        ],
        modules: [
            __dirname + '/node_modules'
        ],
        symlinks: true
    },
    resolveLoader: {
        modules: [
            __dirname + '/node_modules'
        ]
    },
    devtool: 'source-map',
    entry: {
        main: source
    },
    output: {
        path: target,
        filename: 'theme.bundle.js', // Name of generated bundle after build
        chunkFilename: '[id].chunk.js',
        publicPath: '/' // public URL of the output directory when referenced in a browser
    },
    module: {  // where we defined file patterns and their loaders
        rules: [
            {
                exclude: [],
                test: /\.scss$|\.sass$/,
                loader: ExtractTextPlugin.extract([
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: true,
                            importLoaders: 1
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            ident: 'postcss',
                            sourceMap: true,
                            plugins: postcssPlugins
                        }
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: true,
                            precision: 8,
                            includePaths: []
                        }
                    }
                ])
            },
            {
                exclude: /node_modules\/(?!loader-utils\/).*/,
                test: /\.js$/,
                loader: [
                    {
                        loader: 'babel-loader',
                        options: {

                        }
                    }
                ]
            },
            {
                test: /\.(eot|svg|cur)$/,
                loader: 'file-loader?name=[name].[hash:20].[ext]', options: {outputPath: target}

            },
            {
                test: /\.(jpg|png|webp|gif|otf|ttf|woff|woff2|ani)$/,
                loader: 'url-loader?name=[name].[hash:20].[ext]&limit=10000', options: {outputPath: target}
            }
        ]
    },
    plugins: [  // Array of plugins to apply to build chunk
        new ExtractTextPlugin('theme.bundle.css'),
        new NoEmitOnErrorsPlugin(),
        new SourceMapDevToolPlugin({
            'filename': '[file].map[query]',
            'moduleFilenameTemplate': '[resource-path]',
            'fallbackModuleFilenameTemplate': '[resource-path]?[hash]',
            'sourceRoot': 'webpack:///'
        }),
        new CopyWebpackPlugin(images.map((elem) => {
            return {
                context: elem,
                to: target + '/images',
                from: {
                    glob: '**/*',
                    dot: true
                }
            };
        })),
        new CopyWebpackPlugin(fonts.map((elem) => {
            return {
                context: elem,
                to: target + '/fonts',
                from: {
                    glob: '**/*',
                    dot: true
                }
            };
        })),
        new CompressionPlugin({
            test: /\.js$|\.css$/
        }),
        new ProvidePlugin({
            $: ['jquery'],
            jQuery: ['jquery'],
            'window.jQuery': 'jquery',
            Popper: ['popper.js', 'default'],
            // individual bootstrap plugins
            Util: 'exports-loader?Util!bootstrap/js/dist/util'
        })
    ]
};

if (PROD) {
    module.exports[0].plugins.push(new UglifyJSPlugin());
}
const path = require('path');

const FaviconsWebpackPlugin = require('favicons-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin'); //installed via npm
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const SocialTags = require('social-tags-webpack-plugin');

const buildPath = path.resolve(__dirname, 'dist');

console.log(88888);

module.exports = {
    devtool: 'source-map',
    entry: './src/index.js',
    output: {
        filename: '[name].[hash:20].js',
        path: buildPath
    },
    node: {
        fs: 'empty'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',

                options: {
                    presets: ['env']
                }
            },
            {
                test: /\.(scss|css|sass)$/,
                use: ExtractTextPlugin.extract({
                    use: [
                        {
                            // translates CSS into CommonJS
                            loader: 'css-loader',
                            options: {
                                sourceMap: true
                            }
                        },
                        {
                            // Runs compiled CSS through postcss for vendor prefixing
                            loader: 'postcss-loader',
                            options: {
                                sourceMap: true
                            }
                        },
                        {
                            // compiles Sass to CSS
                            loader: 'sass-loader',
                            options: {
                                outputStyle: 'expanded',
                                sourceMap: true,
                                sourceMapContents: true
                            }
                        }
                    ],
                    fallback: 'style-loader'
                }),
            }
            ,
            {
                test: /\.html$/,
                use: ['html-loader']
            },
            {
                test: /\.(jpg|png)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            outputPath: 'assets/',
                            publicPath: 'assets/'
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './index.html',
            // Inject the js bundle at the end of the body of the given template
            inject: 'body',
        }),
        new CleanWebpackPlugin(buildPath),
        new FaviconsWebpackPlugin({
            // Your source logo
            logo: './src/assets/icon.png',
            // The prefix for all image files (might be a folder or a name)
            prefix: 'icons-[hash]/',
            // Generate a cache file with control hashes and
            // don't rebuild the favicons until those hashes change
            persistentCache: true,
            // Inject the html into the html-webpack-plugin
            inject: true,
            // favicon background color (see https://github.com/haydenbleasel/favicons#usage)
            background: '#fff',
            // favicon app title (see https://github.com/haydenbleasel/favicons#usage)
            title: 'game-of-life}}',

            // which icons should be generated (see https://github.com/haydenbleasel/favicons#usage)
            icons: {
                android: true,
                appleIcon: true,
                appleStartup: true,
                coast: false,
                favicons: true,
                firefox: true,
                opengraph: false,
                twitter: false,
                yandex: false,
                windows: false
            }
        }),
        new ExtractTextPlugin('styles.[md5:contenthash:hex:20].css', {
            allChunks: true
        }),
        new OptimizeCssAssetsPlugin({
            cssProcessor: require('cssnano'),
            cssProcessorOptions: {
                map: {
                    inline: false,
                },
                zindex: false,
                discardComments: {
                    removeAll: true
                }
            },
            canPrint: true
        }),
        new SocialTags({
            appUrl: 'https://benna100.github.io/random-parti/',
            facebook: {
              'fb:app_id': "123456789",
              'og:url': "https://benna100.github.io/random-parti/",
              'og:type': "website",
              'og:title': "Parti Lykkehjulet - Få hjælp til at vælge et tilfældigt parti",
              'og:image': './src/assets/social.png',
              'og:description': "Til dig der ikke aner hvad du skal stemme på!",
              'og:site_name': "Parti Lykkehjulet - Få hjælp til at vælge et tilfældigt parti",
              'og:locale': "da",
              'og:article:author': "Benjamin Dalsgaard Hughes",
            },
            twitter: {
              "twitter:card": "summary",
              "twitter:site": "@site_account",
              "twitter:creator": "@DalsHughes",
              "twitter:url": "https://benna100.github.io/random-parti/",
              "twitter:title": "Parti Lykkehjulet - Få hjælp til at vælge et tilfældigt parti",
              "twitter:description": "Til dig der ikke aner hvad du skal stemme på!",
              "twitter:image": './src/assets/social.png'
            },
          })
    ]
};

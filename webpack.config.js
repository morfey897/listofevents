/* eslint-disable no-useless-escape */
/* eslint-disable no-undef */
const path = require('path');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const Autoprefixer = require('autoprefixer');
const Dotenv = require('dotenv-webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = (env, argv) => {

  const IS_DEV_SERVER = (argv.mode === 'none');
  const MODE = IS_DEV_SERVER ? "development" : argv.mode;
  const CSS_TO_JS = false;

  let config = {
    mode: MODE,
    entry: {
      app: './src/index.js',
    },
    output: {
      filename: argv.mode === 'none' ? '[name].bandle.js' : '[name].[hash].js',
      path: path.resolve(__dirname, 'dist'),
      publicPath: '/'
    },
    plugins: [
      new Dotenv({
      //   path: `./.env.${MODE}`, // load this now instead of the ones in '.env'
      //   // safe: true, // load '.env.example' to verify the '.env' variables are all set. Can also be a string to a different file.
      //   // systemvars: true, // load all the predefined 'process.env' variables which will trump anything local per dotenv specs.
      //   // silent: true, // hide any errors
      //   defaults: true // load '.env.defaults' as the default values if empty.
      }),
      new CleanWebpackPlugin(),
      new MiniCssExtractPlugin({
        filename: argv.mode === 'none' ? '[name].bandle.css' : '[name].[hash].css'
      }),
      new HtmlWebpackPlugin({
        title: 'Pole of events in the World',
        template: "./public/index.html",
        filename: "./index.html",
        favicon: "./public/favicon/favicon.ico"
      }),
      new CopyWebpackPlugin({
        patterns: [
          {from: "./public/static", to: "./"},
          {from: "./public/favicon", to: "favicon"}
        ],
      })
    ],
    optimization: {
      minimize: !IS_DEV_SERVER
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {loader: 'babel-loader'}
        },
        {
          test: /\.html$/,
          use: {loader: "html-loader"}
        },
        {
          test: /\.(png|jpg|jpeg)$/,
          include: /[\\\/](public|core[\\\/]assets)[\\\/]imgs[\\\/]/,
          use: {
            loader: 'file-loader',
            options: {
              esModule: false,
              outputPath: 'assets/images',
              name: '[name].[ext]'
            }
          }
        },
        {
          test: /\.(svg|gif)$/,
          include: /[\\\/](public|core[\\\/]assets)[\\\/]icons[\\\/]/,
          use: {
            loader: 'file-loader',
            options: {
              outputPath: 'assets/icons',
              name: '[name].[ext]',
              esModule: false
            }
          }
        },
        {
          test: /\.(woff(2)?|ttf|eot|svg)$/,
          include: /[\\\/](public|core[\\\/]assets)[\\\/]fonts[\\\/]/,
          use: {
            loader: 'file-loader',
            options: {
              outputPath: 'assets/fonts',
              name: '[name].[ext]',
              esModule: false
            }
          }
        },
        {
          // For pure CSS (without CSS modules)
          test: /\.(pure\.scss|pure\.sass|css)$/,
          use: [
            CSS_TO_JS ? {loader: "style-loader"} : MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader'
            },
            {
              loader: "postcss-loader",
              options: {
                ident: 'postcss',
                plugins: [
                  new Autoprefixer()
                ]
              }
            },
            {
              loader: "sass-loader"
            }
          ]
        },
        {
          test: /\.module\.(sc|sa|c)ss$/,
          use: [
            CSS_TO_JS ? {loader: "style-loader"} : MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                importLoaders: 2,
                modules: true,
                localIdentName: '[local]_[hash:base64:5]'
              }
            },
            {
              loader: "postcss-loader",
              options: {
                ident: 'postcss',
                plugins: [
                  new Autoprefixer(),
                  // new PostcssRTL()
                ]
              }
            },
            {
              loader: "sass-loader"
            }
          ]
        }
      ]
    }
  };

  /**
  * DevServer
  */
  if (argv.mode === 'none') {
    config.devtool = "eval";
    config.output.path = path.resolve(config.output.path, 'devServer');
    config.devServer = {
      contentBase: path.resolve(__dirname, './src'),
      watchContentBase: true,
      historyApiFallback: true,
      hot: true,
      allowedHosts: [
        'dev-data.take.travel',
        'dev.take.travel',
        'take.travel'
      ]
    };
  }

  /**
  * Development
  */
  if (argv.mode === 'development') {
    config.devtool = 'source-map';
    config.output.path = path.resolve(config.output.path, 'dev');
  }

  /**
  * Product
  */
  if (argv.mode === 'production') {
    config.devtool = 'hidden-source-map';
    config.output.path = path.resolve(config.output.path, 'prod');
    config.profile = true;
    let StatsPlugin = require('stats-webpack-plugin');

    config.plugins = [...(config.plugins || []),
      new StatsPlugin('stats.json')
    ];
  }
  return config;
};

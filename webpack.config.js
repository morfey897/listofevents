/* eslint-disable no-useless-escape */
/* eslint-disable no-undef */
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const DotenvWebpack = require('dotenv-webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const RobotstxtPlugin = require("robotstxt-webpack-plugin");
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const Dotenv = require('dotenv');

const PREFIX = [""];
const DISALOW_LINKS = [];
module.exports = (env, argv) => {

  const { parsed: DOTENV } = Dotenv.config();
  const MODE = argv.mode;

  const CSS_TO_JS = true;
  const ASSETS_VERSION = `v${DOTENV.VERSION.split(".").slice(0, 1).join("_")}`;
  const CSS_VERSION = `v${DOTENV.VERSION.split(".").slice(0, 2).join("_")}`;
  const VERSION = `v${DOTENV.VERSION.split(".").join("_")}`;

  let config = {
    mode: MODE,
    entry: {
      app: './src/index.js',
    },
    devtool: argv.mode === 'development' ? 'eval' : 'source-map',
    output: {
      filename: argv.mode === 'development' ? '[name].bandle.js' : `[name].${VERSION}.js`,
      path: path.resolve(__dirname, argv.mode === 'development' ? './dist/dev' : './dist/prod'),
      publicPath: '/'
    },
    target: argv.mode === 'development' ? "web" : "browserslist",
    devServer: {
      contentBase: path.resolve(__dirname, './dist/dev'),
      watchContentBase: true,
      historyApiFallback: true,
      hot: true,
      allowedHosts: [
        'pdevents.com.ua',
        'data.pdevents.com.ua'
      ]
    },
    plugins: [
      new DotenvWebpack({}),
      new CleanWebpackPlugin(),
      new MiniCssExtractPlugin({
        filename: argv.mode === 'development' ? '[name].bandle.css' : `[name].${CSS_VERSION}.css`
      }),
      new HtmlWebpackPlugin({
        title: DOTENV.TITLE,
        template: "./static/index.ejs",
        filename: "./index.html",
        favicon: "./static/favicon/favicon.ico"
      }),
      new CopyWebpackPlugin({
        patterns: [
          { from: "./static/_copy", to: "./" },
          { from: "./static/favicon", to: "favicon" }
        ],
      }),
      new RobotstxtPlugin(DOTENV.ROBOTS === "true" ? {
        policy: [
          {
            userAgent: "*",
            allow: "/",
            disallow: DISALOW_LINKS.map((link) => PREFIX.map(pref => `${pref}${link}$`)),
          }
        ],
        sitemap: DOTENV.SITEMAP,
        host: DOTENV.HOST,
      } : {})
    ],
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: { loader: 'babel-loader' }
        },
        {
          test: /\.ejs$/,
          use: {
            loader: 'ejs-loader',
            options: {
              esModule: false
            }
          }
        },
        {
          test: /\.(png|jpg|jpeg)$/,
          include: /[\\\/](static[\\\/]assets)[\\\/]imgs[\\\/]/,
          use: {
            loader: 'file-loader',
            options: {
              esModule: false,
              outputPath: 'assets/images',
              name: `[name].${ASSETS_VERSION}.[ext]`
            }
          }
        },
        {
          test: /\.(svg|gif)$/,
          include: /[\\\/](static[\\\/]assets)[\\\/]icons[\\\/]/,
          use: ['@svgr/webpack'],
        },
        {
          test: /\.(woff(2)?|ttf|eot|svg)$/,
          include: /[\\\/](static[\\\/]assets)[\\\/]fonts[\\\/]/,
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
          test: /\.css$/,
          use: [
            CSS_TO_JS ? { loader: "style-loader" } : MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
            }
          ]
        },
        {
          // For pure CSS (without CSS modules)
          test: /\.pure\.(sc|sa|c)ss$/,
          use: [
            CSS_TO_JS ? { loader: "style-loader" } : MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                importLoaders: 2,
              }
            },
            {
              loader: "postcss-loader",
            },
            {
              loader: "sass-loader"
            }
          ]
        },
        {
          test: /\.module\.(sc|sa|c)ss$/,
          use: [
            CSS_TO_JS ? { loader: "style-loader" } : MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                importLoaders: 2,
                modules: {
                  localIdentName: '[local]_[hash:base64:5]'
                },
              }
            },
            {
              loader: "postcss-loader",
            },
            {
              loader: "sass-loader"
            }
          ]
        }
      ]
    },
    optimization: {
      minimize: true,
      minimizer: [
        `...`,
        new CssMinimizerPlugin(),
      ],
    }
  };
  return config;
};

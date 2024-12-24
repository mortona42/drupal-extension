import path from 'path';
import { fileURLToPath } from 'url';
import CopyPlugin from 'copy-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import WebExtPlugin from 'web-ext-plugin';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  mode: 'production',
  context: path.resolve(__dirname, './src'),
  devtool: 'eval-source-map',
  plugins: [
    new WebExtPlugin({
      sourceDir: __dirname + '/dist',
      startUrl: 'https://www.drupal.org/project/project_module?f%5B0%5D=&f%5B1%5D=&f%5B2%5D=&f%5B3%5D=&f%5B4%5D=sm_field_project_type%3Afull&f%5B5%5D=&f%5B6%5D=&text=&solrsort=ds_project_latest_release+desc&op=Search'
    }),
    new CopyPlugin({
      patterns: [
        {from: "./manifest.json", to: "./"},
        {from: "./icons", to: "./icons"},
        {from: "./browserAction/*.css", to: "./"},
        {from: "./options/*.css", to: "./"},
        {from: "./styles.css", to: "./"},
      ]
    }),
    new HtmlWebpackPlugin({
      template: './browserAction/index.html',
      filename: 'index.html',
      chunks: ['index'],
    }),
    new HtmlWebpackPlugin({
      template: './options/index.html',
      filename: 'index.html',
      chunks: ['index'],
    }),
    new HtmlWebpackPlugin({
      template: './pageAction/index.html',
      filename: 'index.html',
      chunks: ['index'],
    }),
  ],
  entry: {
    content_script: './content_script.js',
    background_script: './background_script.js',
    browser_action: './browserAction/script.js',
    options: './options/script.js',
  },
  output: {
    clean: true,
    path: path.resolve(__dirname, 'dist'),
  },
  // module: {
  //   rules: [
  //     {
  //       test: /\.json/,
  //       type: "asset/source"
  //     }
  //   ]
  // }
};

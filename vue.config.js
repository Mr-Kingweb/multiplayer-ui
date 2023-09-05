const { defineConfig } = require('@vue/cli-service')
const path = require('path');
const webpack = require('webpack');
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const productionGzipExtensions = ['js', 'css'];

module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    port: 8087, // 指定前端启动端口
    proxy: {
      // 在开发环境下，将 '/api' 开头的请求代理到后端服务器
      '/api': {
        target: 'http://127.0.0.1:8086', // 后端服务器地址
        changeOrigin: true, // 支持跨域
        pathRewrite: {
          '^/api': '' // 去掉请求路径中的 '/api' 前缀
        }
      }
    }
  },
  // 取消部署压缩 map 文件 在 生产环境中1
  productionSourceMap: false,
  configureWebpack: {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@i': path.resolve(__dirname, './src/assets')
      }
    },
    plugins: [
      new webpack.IgnorePlugin({
        resourceRegExp: /^\.\/locale$/,
        contextRegExp: /moment$/
      }),
      new CompressionWebpackPlugin({
        algorithm: 'gzip',
        test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
        threshold: 10240,
        minRatio: 0.8
      })
    ]
  },
  css: {
    loaderOptions: {
      less: {
        lessOptions: {
          javascriptEnabled: true,
        },
      },
    },
  },
})

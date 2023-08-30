const { defineConfig } = require('@vue/cli-service')

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

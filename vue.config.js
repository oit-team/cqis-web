module.exports = {
  productionSourceMap: false,
  publicPath: './',
  outputDir: 'dist', // 输出文件目录
  lintOnSave: false, // eslint 是否在保存时检查
  assetsDir: 'static', // 配置js、css静态资源二级目录的位置
  devServer: {
    port: '2060',
    open: true,
    proxy: {
      '/api': {
        target: 'http://192.168.9.68:9810',
        changeOrigin: true,
        pathRewrite: { '^/api': '/' },
      },
      '/user-server': {
        target: 'http://192.168.9.68:9810',
        changeOrigin: true,
        pathRewrite: { '^/user-server': '/user-server' },
      },
      '/task-server': {
        target: 'http://192.168.9.68:9810',
        changeOrigin: true,
        pathRewrite: { '^/task-server': '/task-server' },
      },
      '/work-server': {
        target: 'http://192.168.9.68:9810',
        changeOrigin: true,
        pathRewrite: { '^/work-server': '/work-server' },
      },
    },
  },
}

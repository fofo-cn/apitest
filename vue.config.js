module.exports = {
  publicPath: '/api/',
  assetsDir: 'publice',
  outputDir: '../dists/api', // 打包的目录
  productionSourceMap: false, // 生产环境是否生成 SourceMap
  filenameHashing: true,
  configureWebpack: {
    devtool: 'source-map',
  },
}
const path = require('path');
module.exports = {
  devServer: {
    open: false, //设置自动打开
    port: 8080, //设置端口
  },
  configureWebpack: (config) => {
    config.resolve = {
      ...config.resolve,
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    };
  },
  chainWebpack(config) {
    // 去除请求多出现503的时候
    config.plugins.delete('prefetch');
    // 解决i18n控制台警告
    config.resolve.alias.set('vue-i18n', 'vue-i18n/dist/vue-i18n.cjs.js');
  },
};

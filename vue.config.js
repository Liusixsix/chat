module.exports = {
    lintOnSave: false, //
    chainWebpack: config => {
        config.output.filename('[name].[hash].js').end();
      },
    devServer: {
        host: '0.0.0.0', // ip
        port: 8080, // 设置端口号
        disableHostCheck: true,
        https: false, // https:{type:Boolean}
        open: false, //配置自动启动浏览器
        proxy:{
            '/api':{
                target: 'http://47.96.112.218:8021/',
                ws: true,
                changOrigin: true,
                pathRewrite: {
                  '^/api': ''
                }
            }
        }  //设置代理
    }
}
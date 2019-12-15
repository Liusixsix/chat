const isProduction = process.env.NODE_ENV === 'production';
module.exports = {
    lintOnSave: false, //
    publicPath: './',
    chainWebpack: config => {
        config.output.filename('[name].[hash].js').end();
    },

    configureWebpack: config => {
        if (isProduction) {
            config.externals = {
                'moment': 'moment'
               },
            // 开启分离js
            config.optimization = {
                runtimeChunk: 'single',
                splitChunks: {
                    chunks: 'all',
                    maxInitialRequests: Infinity,
                    minSize: 20000,
                    cacheGroups: {
                        vendor: {
                            test: /[\\/]node_modules[\\/]/,
                            name(module) {
                                // get the name. E.g. node_modules/packageName/not/this/part.js
                                // or node_modules/packageName
                                const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1]
                                // npm package names are URL-safe, but some servers don't like @ symbols
                                return `npm.${packageName.replace('@', '')}`
                            }
                        }
                    }
                }
            };
        }
    },

    devServer: {
        host: '0.0.0.0', // ip
        port: 8080, // 设置端口号
        disableHostCheck: true,
        https: false, // https:{type:Boolean}
        open: false, //配置自动启动浏览器
        hotOnly: true, // 热更新
        proxy: {
            '/api': {
                // target: 'http://192.168.0.42:8021/',
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
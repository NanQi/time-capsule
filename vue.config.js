const path = require('path')

module.exports = {
    configureWebpack: {
        resolve: {
            alias: {
                contracts: path.resolve('build/contracts')
            }
        }
    }
}
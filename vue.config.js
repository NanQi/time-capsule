const path = require('path')

module.exports = {
    chainWebpack: config => {
        if(process.env.NODE_ENV === 'production') {
			config.devtool()

			let prefix = 'nanqi/chain/'
			config
				.output
				.publicPath('http://lib.my2space.com/' + prefix)
		}
    }
}
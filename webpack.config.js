var webpack = require('webpack')
module.exports = {
	entry: ["./index.js","webpack/hot/dev-server"],
	devtool: "source-map",
	output: {
		path: __dirname,
		filename: "bundle.js"
	},
	module: {
		loaders: [
			{ test: /\.js$/, exclude: /node_modules/, loader: "babel" },
		]
	},
	plugins: [ new webpack.HotModuleReplacementPlugin() ]
}
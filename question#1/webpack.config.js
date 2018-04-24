const cwd = process.cwd()
const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')

const config = {
	entry: {
		app: './src/index.js'
	},
	output: {
		path: `${cwd}/dist`,
		filename: 'bundle.js',
		publicPath: '/'
	},
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './dist',
    hot: true
  },
	module: {
		rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader?cacheDirectory=true',
        include: [`${cwd}/src`]
      },
			{
				test: /\.styl$/,
				use: [
			    { loader: 'style-loader', options: { sourceMap: true } },
			    { loader: 'css-loader', options: { sourceMap: true } },
			    { loader: 'postcss-loader', options: { sourceMap: true } },
			    { loader: 'stylus-loader', options: { sourceMap: true } },
				]
			},
			{
				test: /\.css$/,
				use: ['style-loader','css-loader']
			},
		]
	},
	plugins: [
		new CleanWebpackPlugin(['dist']),
		new HtmlWebpackPlugin({ template: `./index.html` }),
		new webpack.NamedModulesPlugin(),
		new webpack.HotModuleReplacementPlugin()
	]
}

module.exports = config

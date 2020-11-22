const path = require('path');
const CleanPlugin = require('clean-webpack-plugin');

module.exports = {
    mode: 'production',
    entry: './src/main.js',
    output: {
        filename: 'app.js',
        path: path.resolve(__dirname, 'assets', 'scripts'),
        publicPath: 'assets/scripts/'
    },
    devServer: {
        contentBase: './'
    },
    target: 'web',
    devtool: 'cheap-source-map',
    plugins: [
        new CleanPlugin.CleanWebpackPlugin()
    ]

}
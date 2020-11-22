const path = require('path');
const {
    CleanWebpackPlugin
} = require('clean-webpack-plugin');


module.exports = {
    mode: 'development',
    entry: './src/main.js',
    devServer: {
        publicPath: '/assets/scripts/'
    },
    devtool: 'cheap-module-eval-source-map',
    // plugins: [
    //     new CleanWebpackPlugin({
    //         cleanStaleWebpackAssets: false
    //     }),
    // ],
    output: {
        filename: 'app.js',
        path: path.join(__dirname, 'assets', 'scripts'),
        publicPath: '/assets/scripts/'
    },

}
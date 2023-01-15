const path = require('path')
module.exports = {
    mode: 'development',
    entry: path.join(__dirname, '/src/index.js'),
    devtool: 'source-map',
    output: {
        path: path.join(__dirname, '/dist'),
        filename: '[name].js'
    },
    resolve: {
        alias: {
            query: 'src/bil/query.js'
        }
    },
    module: {
        rules: [
            {
                test: /\.tet$/, use: 'raw-loader'
            }
        ]
    },
    // plugins: [
    //     new HtmlWebpackPlugin({template: './src/index.html'})
    // ]
}
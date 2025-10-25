import path from 'path';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

const __dirname = import.meta.dirname

export default {
    entry: path.resolve(__dirname, "../src/client/scripts/main.ts"),
    output: {
        path: path.resolve(__dirname, '../dist/webpack'),
        filename: 'scripts/[name].js',
        clean: true,
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.pug']
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                include: [
                    path.resolve(__dirname, '../src/client'),
                    path.resolve(__dirname, '../src/common')
                ]
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader'
                ],
                include: path.resolve(__dirname, '../src/client/styles')
            },
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'css/styles.css'
        }),
    ],
    mode: 'development',
    devServer: {
        static: {
            directory: path.join(__dirname, 'dist/webpack'),
        },
        client: {
            overlay: {
                errors: true,
                warnings: false,
                runtimeErrors: true,
            },
        },
        compress: false,
        port: 5000,
    }
};
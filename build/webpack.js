import path from 'path';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { glob } from 'glob';

const __dirname = import.meta.dirname

function getPugPages() {
    const pugFiles = glob.sync('src/client/pages/**/*.pug');
    return pugFiles.map(file => {
        const relativePath = path.relative('src/client/pages', file);
        const dirname = path.dirname(relativePath);
        const name = path.basename(file, '.pug');

        return new HtmlWebpackPlugin({
            template: file,
            filename: path.join('pages', dirname, `${name}.html`),
            minify: false
        });
    });
}

export default {
    entry: path.resolve(__dirname, "../src/client/scripts/main.ts"),
    output: {
        path: path.resolve(__dirname, '../dist/webpack'),
        filename: 'scripts/[name].js',
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
            {
                test: /\.pug$/,
                use: [
                    {
                        loader: 'pug-loader',
                        options: {
                            pretty: true
                        }
                    }
                ]
            },
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'css/styles.css'
        }),
        ...getPugPages(),
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
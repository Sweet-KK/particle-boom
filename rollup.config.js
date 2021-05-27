import templateExternalFiles from './plugins/html-externals'
import eslint from '@rollup/plugin-eslint'
const pcg = require('./package.json')
const resolve = require('rollup-plugin-node-resolve')
const commonjs = require('rollup-plugin-commonjs')
const { terser } = require('rollup-plugin-terser')
const serve = require('rollup-plugin-serve')
const livereload = require('rollup-plugin-livereload')
const html = require('@rollup/plugin-html')
const babel = require('rollup-plugin-babel')

const isDev = process.env.NODE_ENV === 'development'
const distDir = isDev ? './docs' : './lib'

var definePlugins = [
    eslint({
        throwOnError: true,
        throwOnWarning: true,
        include: ['src/**'],
        exclude: ['node_modules/**']
    }),
    commonjs(), // 解析commonjs语法
    resolve(), // 获取node_modules依赖包
    babel({
        exclude: 'node_modules/**'
    }),
    terser() // 压缩
]
// const OutputName = `${pcg.name}-${pcg.version}.js`

// 判断是否为watch
if (isDev) {
    definePlugins = definePlugins.concat([
        html({
            title: 'Test Page',
            attributes: { html: { lang: 'zh-cn' } },
            fileName: 'index.html',
            publicPath: './',
            template: templateExternalFiles([
                { type: 'css', src: 'https://animate.style/animate.min.css', pos: 'before' },
                { type: 'css', file: 'static/index.css', pos: 'before' },
                { type: 'js', file: 'static/index.js' }
            ])
        }),
        livereload({
            watch: ['src', 'docs/static']
        }),
        serve({
            open: true,
            port: 8000,
            openPage: `/docs/index.html`
        })
    ])
}

const pkgName = pcg.name.split('-').map(o => o.slice(0, 1).toUpperCase() + o.slice(1)).join('') // 短横线命名转帕斯卡命名

module.exports = {
    input: './src/index.js',
    output: isDev ? {
        file: `${distDir}/${pcg.name}.umd.js`,
        format: 'umd',
        name: pkgName
    } : [
        {
            file: `${distDir}/${pcg.name}.cjs.js`,
            format: "cjs"
        },
        {
            file: `${distDir}/${pcg.name}.esm.js`,
            format: "esm"
        },
        {
            file: `${distDir}/${pcg.name}.iife.js`,
            format: "iife",
            name: pkgName
        },
        {
            file: `${distDir}/${pcg.name}.umd.js`,
            format: "umd",
            name: pkgName
        }
    ],
    plugins: definePlugins
}
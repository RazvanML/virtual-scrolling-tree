let pkg = require('./package.json');
let buble = require('rollup-plugin-buble');

module.exports = {
    input: `src/virtual-scrolling-tree/VirtualScrollingTree.js`,
    plugins: [
        buble()
    ],
    output: [
        { file: pkg.main, format: 'cjs' },
        { file: pkg.browser, format: 'umd', name: 'VirtualScrollingTree'},
        { file: pkg.module, format: 'es' }
    ]
}
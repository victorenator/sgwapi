const {dest, src} = require('gulp');
const babel = require('gulp-babel');
const eslint = require('gulp-eslint');

function lintJS() {
    return src('*.mjs')
        .pipe(eslint());
}

function compile() {
    return src('*.mjs')
        .pipe(babel({
            plugins: ['@babel/plugin-transform-modules-commonjs']
        }))
        .pipe(dest('.'));
}

exports.default = compile;
exports['lint-js'] = lintJS;

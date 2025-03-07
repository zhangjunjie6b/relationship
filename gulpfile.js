const gulp = require('gulp');
const rename = require("gulp-rename");
const cht = require('gulp-cht');
const rollup = require('rollup');
const terser = require('@rollup/plugin-terser');
const pkg = require('./package');

// copyright
var repository = pkg.repository.url.replace(/(.+)(:\/\/.+)\.git$/,'https$2');
var now = new Date();
var date = (new Date(now.getTime()-now.getTimezoneOffset()*60000)).toISOString().substr(0,10);
var banner = `/*!
 * ${pkg.name} v${pkg.version}
 * ${pkg.description}
 * ${pkg.homepage}
 *
 * Copyright (c) 2016-present, ${pkg.author}
 *
 * Released under the ${pkg.license} License
 * ${repository}
 *
 * Created on: ${date}
 */`;

gulp.task('build', () => {
    return rollup.rollup({
        input: './src/relationship.js',
        plugins: [
            terser()
        ]
    }).then(bundle => {
        return bundle.write({
            file: './dist/relationship.min.js',
            format: 'umd',
            name: 'relationship',
            banner
        });
    });
});

gulp.task('mode', () => {
    return rollup.rollup({
        input: './src/relationship-mode.js',
        plugins: [
            terser()
        ]
    }).then(bundle => {
        return bundle.write({
            file: './dist/relationship-mode.min.js',
            format: 'umd',
            name: 'relationshipMode',
        });
    });
});

gulp.task('localization', () => {
    // gulp.src('./index.html')
    // .pipe(cht())
    // .pipe(rename("zh-HK.html"))
    // .pipe(gulp.dest("./"));

    return gulp.src([
        'dist/relationship.min.js',
        'dist/relationship-mode.min.js',
    ]).pipe(cht())
    .pipe(rename(function(path) {
        path.basename = path.basename.replace('.min','.zh-HK.min');
    }))
    .pipe(gulp.dest('dist/'))
});

gulp.task('default', gulp.series(['build', 'mode', 'localization']))

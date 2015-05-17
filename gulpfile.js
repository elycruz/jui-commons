/**
 * Created by Ely on 12/26/2014.
 */

'use strict';

require('sjljs');

var gulp = require('gulp'),
    eslint = require('gulp-eslint'),
    srcs = ['./src/**/*.js', './tests/**/*.js'],
    concat = require('gulp-concat'),
    fs = require('fs'),
    path = require('path');

gulp.task('eslint', function () {
    gulp.src(srcs)
        .pipe(eslint({useEslintrc: true}))
        .pipe(eslint.format('stylish'))
        .pipe(eslint.failAfterError());
});

gulp.task('watch', function () {
    gulp.watch(srcs, ['eslint']);
});

gulp.task('default', ['eslint', 'watch']);
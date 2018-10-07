// Dependencias
var gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    minifycss = require('gulp-minify-css');

// Tarea 1 llamada minify-js
gulp.task('minify-js', function () {
    gulp.src('App/*.js')
        .pipe(concat('build.js'))
        .pipe(uglify())
        .pipe(gulp.dest('build/'))
});

// Tarea 2 llamada minify-css
gulp.task('minify-css', function () {
    gulp.src('Content/css/*.css')
        .pipe(concat('build.css'))
        .pipe(minifycss())
        .pipe(gulp.dest('build/'))
});
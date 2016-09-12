'use strict';

// Section 0: Define Elements

//// 0. Base: Gulp
var gulp = require('gulp');

//// 0. LiveReload
var browserSync = require('browser-sync').create();

//// 0. Sass
var sass = require('gulp-sass');

//// 0. Eslint
var eslint = require('gulp-eslint');

//// 0. Minifies (HTML, CSS & Js)
var useref = require('gulp-useref');
var gulpIf = require('gulp-if');
var htmlmin = require('gulp-htmlmin');
var uglify = require('gulp-uglify');
var cssnano = require('gulp-cssnano');

//// 0. BowerFonts (From Bootstrap in this case)
var flatten = require('gulp-flatten');

//// 0. Parallel Tasks
var runSequence = require('run-sequence');

// Section 1: Browser Sync - Server
//// 1. Server
gulp.task('browserSync', function () {
  browserSync.init({
    server: {
      baseDir: 'app'
    }
  });
});

//// 1. Sass
gulp.task('sass', function () {
  return gulp.src('app/assets/scss/main.scss')
    .pipe(sass())
    .pipe(gulp.dest('app/assets/styles'));
});

//// 1. Eslint
gulp.task('lint', function () {
  return gulp.src('app/assets/scripts/app.js')
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

//// 1. Watcher
gulp.task('serve', ['browserSync', 'sass'], function () {
  gulp.watch('app/assets/scss/**/*.scss', ['sass']);
  gulp.watch('app/assets/styles/**/*.css', browserSync.reload);
  gulp.watch('app/assets/scripts/**/*.js', ['lint', browserSync.reload]);
  gulp.watch('app/*.html', browserSync.reload);
});

// Section 2: Build
//// 2. Useref (Minify)
gulp.task('useref', function () {
  return gulp.src('app/index.html')
    .pipe(useref())
    .pipe(gulpIf('*.js', uglify()))
    .pipe(gulpIf('*.css', cssnano()))
    .pipe(gulpIf('*.html', htmlmin({collapseWhitespace: true})))
    .pipe(gulp.dest('.')) // Normally use dist to a better order. In my case will use GitHubPages, So I will use the root.
});

//// 2. Copy Bootstrap (& Bower fonts)
gulp.task('fonts', function () {
  return gulp.src('app/bower_components/**/*.{eot,svg,ttf,woff,woff2}')
    .pipe(flatten())
    .pipe(gulp.dest('assets/fonts/'))
});

//// 2. Build
gulp.task('build', function (callback) {
  runSequence(
    ['useref', 'fonts'],
    callback
  );
});

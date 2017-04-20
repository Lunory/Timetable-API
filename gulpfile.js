'use strict';

var gulp = require('gulp');
var plumber = require('gulp-plumber');
var del = require('del');
var server = require('browser-sync').create();
var run = require('run-sequence');

//Minification
var cssNano = require('gulp-cssnano');
var jsMin = require('gulp-jsmin');
var imagemin = require('gulp-imagemin');

//Rename
var rename = require('gulp-rename');

//Concatenate js
var concat = require('gulp-concat');

//PostCSS plugins
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var nested = require('postcss-nested');
var atImport = require('postcss-import');
var mqpacker = require('css-mqpacker');
var customMedia = require('postcss-custom-media');
var cssVariables = require('postcss-css-variables');

//Style
gulp.task('style', function() {
  return gulp.src('src/postcss/style.css')
    .pipe(plumber())
    .pipe(postcss([
      atImport(),
      nested(),
      customMedia(),
      cssVariables(),
      autoprefixer({browsers: [
        'last 2 versions'
      ]}),
      mqpacker({
        sort: true
      })
    ]))
    .pipe(gulp.dest('build/css'))
    .pipe(cssNano())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('build/css'));
});

//Concat JS
gulp.task('scripts', function() {
  return gulp.src(['src/js/timetable/error.js', 'src/js/timetable/utility.js', 'src/js/timetable/tutor.js', 'src/js/timetable/school.js',
    'src/js/timetable/classRoom.js', 'src/js/timetable/lecture.js', 'src/js/timetable/interface.js'])
    .pipe(concat('timetableAPI.js'))
    .pipe(gulp.dest('build/js'));
});

//Concat JS for test
gulp.task('testScripts', function() {
  return gulp.src(['src/js/timetable/error.js', 'src/js/timetable/utility.js', 'src/js/timetable/tutor.js', 'src/js/timetable/school.js',
    'src/js/timetable/classRoom.js', 'src/js/timetable/lecture.js', 'src/js/timetable/interface.js', 'src/test/test.js'])
    .pipe(concat('test.js'))
    .pipe(gulp.dest('test/'));
});

//Min js
gulp.task('js', function() {
  return gulp.src('build/js/*.js')
    .pipe(jsMin())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('build/js'));
});

//Image
gulp.task('images', function() {
  return gulp.src('build/img/*.{png,jpg,gif}')
    .pipe(imagemin([
      imagemin.optipng({optimizationLevel: 3}),
      imagemin.jpegtran({progressive: true})
    ]))
    .pipe(gulp.dest('build/img'));
});

//Clean build
gulp.task('clean', function() {
  return del('build'), del('test');
});



//Copy
gulp.task('copy', function() {
  return gulp.src([
    'src/fonts/**/*.{woff,woff2}',
    'src/img/**',
    'src/js/*.js',
    'src/*.html'
  ], {
    base: './src'
  })
    .pipe(gulp.dest('build'));
});

//Server
gulp.task('html:copy', function() {
  return gulp.src('src/*.html')
    .pipe(gulp.dest('build'));
});

gulp.task('html:update', ['html:copy'], function(done) {
  server.reload();
  done();
});

gulp.task('js:copy', function() {
  return gulp.src('src/js/**/*.js')
    .pipe(gulp.dest('build/js'));
});

gulp.task('js:update', ['js:copy'], function(done) {
  server.reload();
  done();
});

gulp.task('serve', function() {
  server.init({
    server: 'build/',
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch('src/postcss/**/*.css', ['style']);
  gulp.watch('src/js/**/*.js', ['js:update']);
  gulp.watch('src/*.html', ['html:update']);
});

//Run
gulp.task('build', function(done) {
  run('clean', 'copy', 'style', 'scripts', 'js', 'images', done)
});

gulp.task('buildTest', function(done) {
  run('clean', 'testScripts', done)
});
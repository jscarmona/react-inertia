var gulp = require('gulp');
var webpack = require('gulp-webpack');
var concat = require('gulp-concat');
var less = require('gulp-less');
var webpackConf = require('./webpack.config.js');
var babel = require('gulp-babel');
var connect = require('gulp-connect');
var uglify = require('gulp-uglify');

gulp.task('babel', function () {
  return gulp.src('src/js/*.*').pipe(babel()).pipe(gulp.dest('.'));
});

gulp.task('build-less', function () {
  return gulp.src('./src/less/**/*.less').pipe(less()).pipe(gulp.dest('./css')).pipe(connect.reload());
});

gulp.task('build-less-example', function () {
  return gulp.src('./example/less/**/*.less').pipe(less()).pipe(gulp.dest('./example')).pipe(connect.reload());
});

gulp.task("webpack", function () {
  return webpack(webpackConf).pipe(gulp.dest('dist')).pipe(connect.reload());
});

gulp.task('confuse', function () {
  return gulp.src('dist/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('dist'));
});

gulp.task("connect", function () {
  connect.server({
    root: '.',
    livereload: true,
    port: 8003
  });
});

gulp.task('build', ['build-less', 'copy']);

gulp.task('deploy', ['confuse'], function () {
  var gh_pages = require('gulp-gh-pages');
  return gulp.src(['dist/**', 'example/**'], {base: '.'})
    .pipe(gh_pages());
});

gulp.task('default', ['build-less', 'babel', 'build-less-example', 'webpack']);

gulp.task('js', ['babel', 'webpack']);

gulp.task('watch', function () {
  connect.server({
    root: '.',
    livereload: true,
    port: 8003
  });
  gulp.watch('src/**/*.less', ['build-less']);
  gulp.watch(['src/**/*.js', 'src/**/*.jsx'], ['babel', 'webpack']);
  gulp.watch(['example/js/**/*.js', 'example/**/*.jsx'], ['webpack']);
  gulp.watch('example/**/*.less', ['build-less-example']);
});

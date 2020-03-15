'use strict';

const gulp       = require('gulp');
const nunjucks   = require('gulp-nunjucks-render');
const data       = require('gulp-data');
const browserSync = require('browser-sync');
const sass       = require('gulp-sass');

const paths = {
  src: {
    root: 'src/',
    template: 'src/templates/',
    html: 'src/templates/pages/',
    scss: 'src/assets/',
    json: './src/templates/data/site.json'
  },
  dest: {
    root: 'dest/'
  }
};

gulp.task('nunjucks', function() {
  return gulp
    .src(paths.src.html + '**/*.njk')
    .pipe(
      data(function() {
        return require(paths.src.json);
      })
    )
    .pipe(
      nunjucks({
        path: paths.src.template
      })
    )
    .pipe(gulp.dest(paths.dest.root));
});

gulp.task('scss', function () {
  return gulp
    .src(paths.src.scss + '**/*.scss')
    .pipe(
      sass({
        outputStyle: 'expanded'
      }).on('error', sass.logError)
    )
    .pipe(gulp.dest(paths.dest.root + 'assets/css'));
});

gulp.task('browserSync', function() {
  browserSync.init({
    notify: false,
    server: paths.dest.root
  });
});

gulp.task('reload', function() {
  browserSync.reload();
});

gulp.task('watch', function() {
  gulp.watch(paths.src.template + '**/*.njk', gulp.task('nunjucks'));
  gulp.watch(paths.src.scss + '**/*.scss', gulp.task('scss'));
  gulp.watch(
    paths.dest.root + '**/*.+(html|css|js)',
    gulp.task('reload')
  );
});

gulp.task('default', gulp.parallel('browserSync', 'watch'));
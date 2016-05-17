/// <binding Clean='default' ProjectOpened='watch' />
var gulp = require('gulp');
var gutil = require('gulp-util');
var concat = require('gulp-concat');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var filter = require('gulp-filter');
var uglify = require('gulp-uglify');
var less = require('gulp-less');
var sass = require('gulp-sass');
var sh = require('shelljs');
var bower = require('bower');
var livereload = require('livereload');
var mainBowerFiles = require('main-bower-files');

var paths = {
  css: ['./scss/**/*.scss', './css/**/*.css', '!./app/lib/**.*'],
  js: ['./app/app.js', './app/**/*.js', '!./app/lib/**.*'],
  font: './app/fonts/',
  lib: './app/lib/'
};

gulp.task('default', ['css', 'js', 'bower']);

gulp.task('watch', ['default', 'livereload'], function () {
  gulp.watch(paths.css, ['css']);
  gulp.watch(paths.js, ['js']);
});

gulp.task('livereload', function () {
  var server = livereload.createServer();
  server.watch([paths.css, paths.js]);
});

gulp.task('css', function (done) {
  gulp.src(paths.css)
    .pipe(sass())
    .pipe(concat('app.css'))
    .pipe(gulp.dest(paths.lib))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest(paths.lib))
    .on('end', done);
});

gulp.task('js', function (done) {
  gulp.src(paths.js)
    .pipe(filter('**/*.js'))
    .pipe(concat('app.js'))
    .pipe(gulp.dest(paths.lib))
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(paths.lib))
    .on('end', done);
});

gulp.task('bower', ['install'], function (done) {
  var files = mainBowerFiles(),
    jsFilter = filter('**/*.js', { restore: true }),
    cssFilter = filter(['**/*.css'], { restore: true }),
    fontFilter = filter(['**/*.{eot,woff,woff2,svg,ttf,otf}'], { restore: true }),
    everythingElseFilter = filter(['**/*.!{js,css}'], { restore: true }),
    onError = function (err) {
      console.log(err);
    };

  if (!files.length) {
    return done();
  }

  gulp.src(mainBowerFiles())
    .pipe(jsFilter)
    .pipe(concat('bower.js'))
    .on('error', onError)
    .pipe(gulp.dest(paths.lib))
    .pipe(jsFilter.restore)

    .pipe(cssFilter)
    .pipe(less())
    .pipe(concat('bower.css'))
    .on('error', onError)
    .pipe(gulp.dest(paths.lib))
    .pipe(cssFilter.restore)

    .pipe(fontFilter)
    .on('error', onError)
    .pipe(gulp.dest(paths.font))
    .pipe(fontFilter.restore)

    .pipe(everythingElseFilter)
    .pipe(gulp.dest(paths.lib))
    .on('end', done);
});

gulp.task('install', ['git-check'], function () {
  return bower.commands.install()
    .on('log', function (data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function (done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
      );
    process.exit(1);
  }
  done();
});



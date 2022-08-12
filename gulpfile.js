'use strict';

const { src, dest, watch, parallel, series } = require('gulp');
const imagemin = require('gulp-imagemin');

const sass = require('gulp-sass'),
  concat = require('gulp-concat'),
  browserSync = require('browser-sync').create(),
  autoPrefixer = require('gulp-autoprefixer'),
  ssi = require('browsersync-ssi'),
  bssi = require('gulp-ssi'),
  del = require('del'),
  webpack = require('webpack-stream'),
  uglify = require('gulp-uglify-es').default;

function cleanDist() {
  return del('dist');
}

function browsersync() {
  browserSync.init({
    server: {
      baseDir: 'app/',
      middleware: ssi({
        baseDir: 'app/',
        ext: '.html',
      }),
    },
  });
}

function styles() {
  return src('app/scss/style.scss')
    .pipe(
      sass({
        outputStyle: 'compressed',
      }),
    )
    .pipe(concat('style.min.css'))
    .pipe(
      autoPrefixer({
        overrideBrowserlist: ['last 10 version'],
        grid: true,
      }),
    )
    .pipe(dest('app/css'))
    .pipe(browserSync.stream());
}

function buildJs() {
  return src(['node_modules/jquery/dist/jquery.js', './app/js/main.js'])
    .pipe(
      webpack({
        entry: ['babel-polyfill', './app/js/main.js'],
        mode: 'production',
        output: {
          filename: 'script.min.js',
        },
        watch: false,
        module: {
          rules: [
            {
              test: /\.(jsx?)$/,
              use: {
                loader: 'babel-loader',
                options: {
                  presets: ['@babel/preset-env'],
                },
              },
            },
          ],
        },
      }),
    )
    .pipe(uglify())
    .pipe(dest('app/js'))
    .pipe(browserSync.stream());
}

function images() {
  return src('app/img/**')
    .pipe(
      imagemin([
        imagemin.gifsicle({ interlaced: true }),
        imagemin.mozjpeg({ quality: 75, progressive: true }),
        imagemin.optipng({ optimizationLevel: 5 }),
        imagemin.svgo({
          plugins: [{ removeViewBox: true }, { cleanupIDs: false }],
        }),
      ]),
    )
    .pipe(dest('dist/img'));
}

function buildHtml() {
  return src(['app/*.html', '!app/templates/**/*'])
    .pipe(
      bssi({
        root: 'app',
      }),
    )
    .pipe(dest('dist'));
}

function buildPackageHtml() {
  return src(['app/groups/**/*.html'])
    .pipe(
      bssi({
        root: 'app',
      }),
    )
    .pipe(dest('dist/groups'));
}

function build() {
  return src(
    [
      'app/css/style.min.css',
      'app/fonts/**/*',
      'app/js/script.min.js',
      'app/js/jquery.min.js',
      'app/js/jquery.maskedinput.min.js',
      'app/js/aos.min.js',
      'app/js/Winwheel.min.js',
    ],
    {
      base: 'app',
    },
  ).pipe(dest('dist'));
}

function watching() {
  watch(['app/scss/**/*.scss'], styles);
  watch(['app/js/**/*.js', '!app/js/script.min.js'], buildJs);
  watch(['app/*.html']).on('change', browserSync.reload);
  watch(['app/groups/**/*.html']).on('change', browserSync.reload);
}

exports.styles = styles;
exports.browsersync = browsersync;
exports.image = images;
exports.buildhtml = buildHtml;
exports.cleandist = cleanDist;
exports.buildjs = buildJs;
exports.htmlpackage = buildPackageHtml;

exports.build = series(cleanDist, images, build, buildHtml, buildPackageHtml);
exports.default = parallel(styles, buildJs, browsersync, watching);

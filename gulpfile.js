const { src, dest, watch, series, parallel } = require('gulp');

// CSS y SASS
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const cssnano = require('cssnano');

// Images
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const avif = require('gulp-avif');

function css(done) {
  // COMPILE SASS
  // pasos: 1 - identificar archivo, 2 - Compilarla, 3 - Guardar el css
  src('src/scss/app.scss')
    .pipe( sourcemaps.init() )
    .pipe(sass())
    .pipe( postcss([ autoprefixer(), cssnano() ]) )
    .pipe( sourcemaps.write('.'))
    .pipe(dest('build/css'));

  done();
}

function images(done) {
  src('src/img/**/*')
    .pipe(imagemin({ optimizationLevel: 3 }))
    .pipe(dest('build/img'));

  done();
}

function versionAvif(params) {
  const options = {
    quality: 50
  }
  return src('src/img/**/*.{png,jpg}')
    .pipe(avif(options))
    .pipe(dest('build/img'))
}

function versionWebp(params) {
  const options = {
    quality: 50
  }
  return src('src/img/**/*.{png,jpg}')
    .pipe(webp(options))
    .pipe(dest('build/img'))
}

function dev() {
  watch('src/scss/**/*.scss', css);
  watch('src/img/**/*', images);
}

exports.css = css;
exports.dev = dev;
exports.images = images;
exports.versionWebp = versionWebp;
exports.versionAvif = versionAvif;
exports.default = series(images, versionWebp, versionAvif, css, dev);

// series - Se inicia una tarea, y hasta que finaliza, inicia la siguiente
// parallel - Todas inician al mismo tiempo

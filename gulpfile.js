
import gulp from 'gulp';
import plumber from 'gulp-plumber';
import htmlmin from 'gulp-htmlmin';
import less from 'gulp-less';
import postcss from 'gulp-postcss';
import csso from 'postcss-csso';
import rename from 'gulp-rename';
import terser from 'gulp-terser';
import squoosh from 'gulp-libsquoosh';
import svgo from 'gulp-svgmin';
import svgstore from 'gulp-svgstore';
import del from 'del';
import autoprefixer from 'autoprefixer';
import browser, { reload } from 'browser-sync';

// Clean

const clean = () => {
  return del("build");
};

// Styles

export const styles = () => {
  return gulp.src('source/less/style.less', { sourcemaps: true })
    .pipe(plumber())
    .pipe(less())
    .pipe(postcss([
      autoprefixer(),
      csso()
    ]))
    .pipe(rename('style.min.css'))
    .pipe(gulp.dest('build/css', { sourcemaps: '.' }))
    .pipe(browser.stream());
}

// Scripts

export const scriptons = () => {
  return gulp.src('source/js/*.js')
  .pipe(terser())
  .pipe(gulp.dest('build/js'))
  .pipe(browser.stream());
  }

// HTML

const html = () => {
  return gulp.src('source/*.html')
   .pipe(htmlmin({ collapseWhitespace: true }))
   .pipe(gulp.dest('build'));

}

// Scripts

const script = () => {
  return gulp.src('source/js/script.js')
  .pipe(gulp.dest('build/js'))
  .pipe(browser.stream());
  }

// Images

const optimizeImages = () => {
  return gulp.src('source/images/**/*.{png,jpg}')
   .pipe(squoosh())
   .pipe(gulp.dest('build/images'))
}

const copyImages = () => {
  return gulp.src('source/images/**/*.{png,jpg}')
  .pipe(gulp.dest('build/images'))
}

// WebP

const createWebp = () => {
  return gulp.src('source/images/**/*.{png,jpg}')
   .pipe(squoosh({
   webp: {}
  }))
  .pipe(gulp.dest('build/images'))
}

// SVG

const svg = () =>
  gulp.src(['source/images/**/*.svg'])
  .pipe(svgo())
  .pipe(gulp.dest('build/images'));

const sprite = () => {
  return gulp.src('source/images/**/*.svg')
  .pipe(svgo())
  .pipe(svgstore({
  inlineSvg: true
}))
.pipe(rename('sprite-build.svg'))
.pipe(gulp.dest('build/images'));
}

//Autoprefixer

export const css = () => {
  return gulp.src('source/**/*.css')
    .pipe(postcss([
      autoprefixer(),
    ]))
    .pipe(gulp.dest('./dest'))
};

// Copy

const copy = (done) => {
  gulp.src([
    'source/fonts/**/*.{woff2,woff}',
    'source/*.ico',
    'source/manifest.webmanifest',
  ], {
    base: 'source'
  })

    .pipe(gulp.dest('build'))
  done();
}

// Server

const server = (done) => {
  browser.init({
    server: {
      baseDir: 'build'
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

// Watcher

const watcher = () => {
  gulp.watch('source/less/**/*.less', gulp.series(styles));
  gulp.watch('source/*.html', gulp.series(html, reload));
}

// Build

export const build = gulp.series(
  clean,
  copy,
  optimizeImages,
  gulp.parallel(
    styles,
    html,
    scriptons,
    svg,
    sprite,
    createWebp
  ),
);

// Default

export default gulp.series(
  clean,
  copy,
  copyImages,
  gulp.parallel(
    styles,
    html,
    scriptons,
    svg,
    createWebp
  ),
  gulp.series(
    server,
    watcher,
  ));

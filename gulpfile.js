
import gulp from 'gulp';
import plumber from 'gulp-plumber';
import htmlmin from 'gulp-htmlmin';
import less from 'gulp-less';
import postcss from 'gulp-postcss';
import csso from 'postcss-csso';
import rename from 'gulp-rename';
import squoosh from 'gulp-libsquoosh';
import del from 'del';
import autoprefixer from 'autoprefixer';
import browser from 'browser-sync';

// Clean

export const clean = () => {
  return del("build");
};

// Styles

const styles = () => {
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

// HTML

 const html = () => {
  return gulp.src('source/*.html')
   .pipe(htmlmin({ collapseWhitespace: true }))
   .pipe(gulp.dest('build'));

}

// Scripts

const script = () => {
  return gulp.src('source/js/*.js')
   .pipe(gulp.dest('build/js'))
   .pipe(browser.stream());
}

// Images

const optimazeImages = () => {
  return gulp.src('source/images/**/*.{png,jpg}')
   .pipe(squoosh())
   .pipe(gulp.dest('build/images'))
}

const copyImages = () => {
  return gulp.src('source/images/**/*.{png,jpg}')
  .pipe(gulp.dest('build/images'))
}

// WebP

export const createWebp = () => {
  return gulp.src('source/images/**/*.{png,jpg}')
   .pipe(squoosh({
   webp: {}
  }))
  .pipe(gulp.dest('build/images'))
}

// SVG

const svg = () =>
  gulp.src(['source/images/*.svg', '!source/images/icons/*.svg'])
  .pipe(svgo())
  .pipe(gulp.dest('build/images'));

const sprite = () => {
  return gulp.src('source/images/icons/*.svg')
  .pipe(svgo())
  .pipe(svgstore({
  inlineSvg: true
}))
.pipe(rename('sprite.svg'))
.pipe(gulp.dest('build/images'));
}

// Copy

export const copy = (done) => {
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
  gulp.watch('source/*.html').on('change', browser.reload);
}


export default gulp.series(
  html, styles, server, watcher
);

// Build

const build = gulp.series(
  clean,
  copy,
  optimizeImages,
  gulp.parallel(
    styles,
    html,
    script,
    sprite,
    createWebp
  ),
);

exports.build = build;

// Default

exports.default = gulp.series(
  clean,
  copy,
  copyImages,
  gulp.parallel(
    styles,
    html,
    script,
    sprite,
    createWebp
  ),
  gulp.series(
    server,
    watcher
  ));

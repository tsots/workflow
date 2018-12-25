const gulp = require('gulp'),
      concat = require('gulp-concat'),
      uglify = require('gulp-uglify'),
      browsersync = require("browser-sync").create(),
      sass = require('gulp-sass'),
      gulpif = require('gulp-if'),
      del = require('del'),
      autoprefixer = require('gulp-autoprefixer');

sass.compiler = require('node-sass');

var env,
    scriptsrc,
    stylessrc,
    outputDir;

env = process.env.NODE_ENV || 'develpoment';

if (env==='development'){
  outputDir = 'dist/';
}else{
  outputDir = 'build/';
}

scriptsrc = ['./bower_components/jquery/dist/jquery.min.js',
                   './bower_components/what-input/dist/what-input.min.js',
                   './bower_components/foundation-sites/dist/js/foundation.min.js',
                   './bower_components/handlebars/handlebars.js',
                   './assets/js/scripts.js',
                   './assets/js/template.js'];
stylessrc = ['./assets/sass/style.scss'];

// BrowserSync
function browserSync(done) {
  browsersync.init({
    server: {
      baseDir: outputDir
    },
    port: 7000
  });
  done();
}

// BrowserSync Reload
function browserSyncReload(done) {
  browsersync.reload();
  done();
}

// Clean assets
function clean() {
  return del(outputDir);
}

function scripts(){
  return gulp.src(scriptsrc)
  .pipe(concat('scripts.js'))
  .pipe(gulpif(env === 'production', uglify()))
  .pipe(gulp.dest(outputDir + 'js'))
  .pipe(browsersync.stream());
};

function styles(){
  return gulp.src(stylessrc)
    .pipe(sass({ includePaths: './bower_components/foundation-sites/scss' }))
      .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
        .pipe(autoprefixer({
          browsers: ['last 2 versions', 'ie >= 9', 'android >= 4.4', 'ios >= 7']
        }))
        .pipe(gulpif(env === 'production', sass({outputStyle: 'compressed'}).on('error', sass.logError)))
          .pipe(gulp.dest(outputDir + 'css'))
          .pipe(browsersync.stream());
};


function html(){
  return gulp.src('./src/**/*.html')
    .pipe(gulp.dest(outputDir))
    .pipe(browsersync.stream());
};

function json(){
  return gulp.src('./src/js/cast.json')
  .pipe(gulp.dest(outputDir + 'js'))
    .pipe(browsersync.stream());
}

function watchFiles(){
  gulp.watch("./assets/sass/*.scss", styles, gulp.series(browserSyncReload));
  gulp.watch("./assets/js/*.js", scripts);
  gulp.watch("./src/js/*.json", json);
  gulp.watch("./src/*.html", html);
};

gulp.task('default', gulp.parallel(styles, scripts, html, json, watchFiles, browserSync));
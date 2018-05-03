var gulp         = require('gulp'),
    browserSync  = require('browser-sync'),
    sass         = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    cleanCSS     = require('gulp-clean-css'),
    uglify       = require('gulp-uglify'),
    renameFiles  = require('gulp-rename');

  gulp.task('browser-sync', function() {
    browserSync.init(null, {
      server: {
            baseDir: ["templates", "app/static"],
            index: "app_base.html",
            directory: false
        },
        options: {
            reloadDelay: 250
        },
        notify: false
    });
  });

  gulp.task('bs-reload', function () {
    browserSync.reload();
  });

  gulp.task('css', function () {
    return gulp.src('src/scss/**/*.scss')
      .pipe(sass().on('error', sass.logError))
      .pipe(autoprefixer('last 3 version'))
      .pipe(gulp.dest('app/static/css'))
      .pipe(cleanCSS({debug: true}, function(details) {
        console.log('Original Size : ' + details.name + ': ' + details.stats.originalSize + ' bytes');
        console.log('Minified Size : ' + details.name + ': ' + details.stats.minifiedSize + ' bytes');
      }))
      .pipe(renameFiles({ suffix: '.min' }))
      .pipe(gulp.dest('app/static/css'))
      .pipe(browserSync.reload({
        stream:true
      }));
  });


  gulp.task('js',function(){
    return gulp.src('src/js/**/*.js')
      .pipe(gulp.dest('app/static/js'))
      .pipe(uglify())
      .pipe(renameFiles({ suffix: '.min' }))
      .pipe(gulp.dest('app/static/js'))
      .pipe(browserSync.reload({
        stream: true,
        once: true
      }));
  });

  gulp.task('default', ['js', 'css', 'browser-sync'], function () {
    gulp.watch("src/scss/**/*.scss", ['css']);
    gulp.watch("src/js/**/*.js", ['js']);
    gulp.watch("templates/*.html", ['bs-reload']);
  });

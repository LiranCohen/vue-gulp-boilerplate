const gulp = require('gulp');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const babelify = require('babelify');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const vueify = require('vueify')

gulp.task('build', function siteBuilder(){
    const bundler = browserify('./main.js', {debug: true})
        .transform(babelify, {presets: ['env']});

    return bundler.bundle()
        .on('error', function(err){
            console.error(err);
            this.emit('end')
        })
        .pipe(source('main.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./dist'));
});

gulp.task('dev', function siteJsBuilder() {
    const bundler = browserify('./main.js', {debug: true})
        .transform(babelify, {presets: ['env']});
    
   return bundler.bundle()
        .on('error', function (err) {
            console.error(err);
            this.emit('end');
        })
        .pipe(source('main.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init())
        .pipe(rename({suffix: '.dev'}))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./dist'));
});

gulp.task('vue', function () {
    const bundler = browserify('./main.js', {debug: true})
        .transform(babelify, {presets: ['env']})
        .transform(vueify);

        return bundler.bundle()
            .on('error', function (err) {
                console.error(err);
                this.emit('end');
            })
            .pipe(source('main.js'))
            .pipe(buffer())
            .pipe(sourcemaps.init())
            .pipe(rename({suffix: '.vue'}))
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest('./dist'));
});

gulp.task('vue:reload', gulp.series('vue',function siteVueWatcher(){
    gulp.watch([
        './**/*.js',
        './**/*.vue',
        './**/*.json',
        './**/*.html',
        '!./dist/**',
        '!./gulpfile.js',
    ], gulp.series('vue'));
}));

gulp.task('dev:reload', gulp.series('dev',function siteJsWatcher(){
    gulp.watch([
        './**/*.js',
        './**/*.json',
        './**/*.html',
        '!./dist/**',
        '!./gulpfile.js',
    ], gulp.series('dev'));
}));

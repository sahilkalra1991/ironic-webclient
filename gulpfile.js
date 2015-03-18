var gulp = require('gulp');
var bower = require('gulp-bower');
var mainBowerFiles = require('main-bower-files');
var filter = require('gulp-filter');
var git = require('gulp-git');
var debug = require('gulp-debug');
var notify = require('gulp-notify');
var webserver = require('gulp-webserver');

var dir = {
    app: ['./app/'],
    dist: './dist'
};

/**
 * Resolve all of our runtime libraries from bower.
 */
gulp.task('bower', function () {
    return bower()
        .pipe(gulp.dest('bower_components/'));
});

/**
 * Resolve all bower javascript dependencies and add them to the /app/lib
 * directory.
 */
gulp.task('update_dependencies',
    [
        '_update_js_dependencies',
        '_update_css_dependencies',
        '_update_font_dependencies'
    ], function() {

    }
);

/**
 * Resolve all javascript dependencies.
 */
gulp.task('_update_js_dependencies', ['bower'], function () {
    return gulp.src(mainBowerFiles())
        .pipe(filter('*.js'))
        .pipe(gulp.dest(dir.app + '/js'));
});

/**
 * Resolve all javascript dependencies.
 */
gulp.task('_update_css_dependencies', ['bower'], function () {
    return gulp.src(mainBowerFiles())
        .pipe(filter('*.css'))
        .pipe(gulp.dest(dir.app + '/css'));
});

/**
 * Resolve all font dependencies.
 */
gulp.task('_update_font_dependencies', ['bower'], function () {
    return gulp.src(mainBowerFiles())
        .pipe(filter(['*.eot', '*.svg', '*.ttf', '*.woff', '*.woff2']))
        .pipe(gulp.dest(dir.app + '/fonts'));
});

/**
 * Start a local server and serve the raw application code. This is equivalent
 * to opening index.html in a browser.
 */
gulp.task('serve:raw', function () {
    return gulp.src(dir.app)
        .pipe(webserver({
            livereload: true,
            open: true
        }));
});
var gulp = require('gulp')
    ,
    concat = require('gulp-concat'),
    watch = require('gulp-watch'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    minify = require('gulp-minify'),
    jsonMinify = require('gulp-json-minify'),
    ngAnnotate = require('gulp-ng-annotate'),
    rtlcss = require('gulp-rtlcss'),
    cleanCSS = require('gulp-clean-css'),
minify = require('gulp-minify');

gulp.task('watch', function() {
    return watch('public/src/*/*.*')
        .pipe(jsonMinify())
        .pipe(rename({ suffix: ".min" }))
        .pipe(gulp.dest('public/dist/'));

})

// this is gulp Task should be run during developing cycle life
gulp.task('default', function() {
    gulp.watch('public/src/js/*.js', ['compress']);
    gulp.watch('public/src/Translations/*.json', ['minify']);
    gulp.watch('public/src/css/myStyle_en.css', ['rtlcss']);
    gulp.watch('public/src/css/*.css', ['minify-css']);
});

gulp.task('minify-css', function() {
    return gulp.src('public/src/css/*.css')
        .pipe(cleanCSS({ debug: true }, function(details) {
            console.log(details.name + ': ' + details.stats.originalSize);
            console.log(details.name + ': ' + details.stats.minifiedSize);
        }))
        .pipe(rename({ suffix: ".min" }))
        .pipe(gulp.dest('public/dist/css/'));
})

gulp.task('compress', () =>
    gulp.src('public/src/js/*.js')
    .pipe(concat('system.js'))
    .pipe(ngAnnotate())
    .pipe(minify())
    // .pipe(zip('test.zip'))
    // .pipe(uglify())
    // .pipe(gzip())
    .pipe(gulp.dest('public/dist/js/'))
);

gulp.task('sloc', function() {
    gulp.src(['controllers/*/*.js','controllers/*.js','notifications/*.js','config/*.js','helpers/*.js','middlewares/*.js','models/*.js'])
        .pipe(sloc());
});


gulp.task('concat', () =>
    gulp.src([
        'public/src/js/vendor/jquery.min.js',
        'public/src/js/vendor/jquery-ui.min.js','public/src/js/vendor/moment.min.js',
        'public/src/js/vendor/angular.min.js', 'public/src/js/vendor/angular-material.min.js', 'public/src/js/vendor/angular-cookies.min.js',
        'public/src/js/vendor/angular-sanitize.js', 'public/src/js/vendor/md-data-table.min.js', 'public/src/js/vendor/sortable.min.js',
        'public/src/js/vendor/lodash.min.js', 'public/src/js/vendor/angular-translate.min.js', 'public/src/js/vendor/angular-translate-loader-url.min.js',
         'public/src/js/vendor/angular-animate.min.js',
        'public/src/js/vendor/jquery-ui.min.js', 'public/src/js/vendor/angular-ui-router.min.js', 'public/src/js/vendor/angular-aria.min.js'
        
    ])
    .pipe(concat('vendor.min.js'))
    // .pipe(minify())
    .pipe(gulp.dest('public/dist/js'))
)

//this is for json Minification
gulp.task('minify', function() {
    return gulp.src('public/src/Translations/*.json')
        .pipe(jsonMinify())
        .pipe(rename({ suffix: ".min" }))
        .pipe(gulp.dest('public/dist/Translations/'));
});

gulp.task('rtlcss', function() {
    return gulp.src('public/src/css/myStyle_en.css')
        .pipe(rtlcss())
        .pipe(rename('myStyle_ar.css'))
        .pipe(gulp.dest('public/src/css/'))
});
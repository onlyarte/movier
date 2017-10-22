// Sass configuration
var gulp = require('gulp');
var sass = require('gulp-sass');

gulp.task('sass', function() {
    return gulp.src('./public/stylesheets/sass/*.sass')
        .pipe(sass())
        .pipe(gulp.dest('./public/stylesheets/css'))
});

gulp.task('default', ['sass'], function() {
    gulp.watch('./public/stylesheets/sass/*.sass', ['sass']);
});
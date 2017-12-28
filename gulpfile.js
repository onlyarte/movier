// Sass configuration
const gulp = require('gulp');
const sass = require('gulp-sass');

gulp.task('sass', () => gulp.src('./public/stylesheets/sass/*.sass')
  .pipe(sass())
  .pipe(gulp.dest('./public/stylesheets/css')));

gulp.task('default', ['sass'], () => {
  gulp.watch('./public/stylesheets/sass/*.sass', ['sass']);
});

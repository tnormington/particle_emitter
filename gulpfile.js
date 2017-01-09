const gulp = require('gulp');
const sass = require('gulp-sass');

gulp.task('default', ['styles'])

gulp.task('styles', function() {
  gulp.src('src/scss/style.scss')
    .pipe(sass())
    .pipe(gulp.dest('build'));
})

gulp.task('watch', function() {
  gulp.watch('src/scss/**/*.scss', ['styles']);
})

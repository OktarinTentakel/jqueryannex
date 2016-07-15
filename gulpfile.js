var BUILD_DEST = 'dist',
    EXAMPLES_DEST = 'examples';

var gulp = require('gulp'),
	sequence = require('run-sequence'),
	rename = require('gulp-rename'),
	sourcemaps = require('gulp-sourcemaps'),
	uglify = require('gulp-uglify'),
    connect = require('gulp-connect'),
    shell = require('gulp-shell');



gulp.task('js', function(){
	return gulp.src([
		'./src/**/*.js'
	])
		.pipe(sourcemaps.init())
			.pipe(uglify())
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest(BUILD_DEST));
});



gulp.task('examples-lib', function(){
	return gulp.src([
		'./src/**/*.js'
	])
		.pipe(gulp.dest(EXAMPLES_DEST+'/lib'));
});



gulp.task('watch', function(){
	gulp.watch('./src/**/*.js', ['js']);
});



gulp.task('server', function(){
	connect.server({
		host : '0.0.0.0',
		root : EXAMPLES_DEST,
		port : 8888
	  });
});



gulp.task('build', function(){
	sequence('js', 'examples-lib');
});



gulp.task('serve', ['build'], function(){
	sequence('server');
});



gulp.task('doc', shell.task([
    'jsdoc -c jsdoc-conf.json'
]));



gulp.task('default', function(){
	sequence('build');
});

var BUILD_DEST = 'dist',
	EXAMPLES_DEST = 'examples',
	DOC_DEST = 'doc';

var gulp = require('gulp'),
	sequence = require('run-sequence'),
	rename = require('gulp-rename'),
	sourcemaps = require('gulp-sourcemaps'),
	uglify = require('gulp-uglify'),
	connect = require('gulp-connect'),
	shell = require('gulp-shell'),
	st = require('st'),
	ava = require('gulp-ava');



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
	gulp.src([
		'./node_modules/jquery-v1/dist/jquery*.*'
	]).pipe(gulp.dest(EXAMPLES_DEST+'/lib/jquery-v1/'));

	gulp.src([
		'./node_modules/jquery-v2/dist/jquery*.*'
	]).pipe(gulp.dest(EXAMPLES_DEST+'/lib/jquery-v2/'));

	gulp.src([
		'./node_modules/jquery-v3/dist/jquery*.*'
	]).pipe(gulp.dest(EXAMPLES_DEST+'/lib/jquery-v3/'));

	return gulp.src([
		'./src/**/*.js'
	]).pipe(gulp.dest(EXAMPLES_DEST+'/lib'));
});



gulp.task('watch', function(){
	gulp.watch('./src/**/*.js', ['watch-build']);
});



gulp.task('server', function(){
	connect.server({
		host : '0.0.0.0',
		root : EXAMPLES_DEST,
		port : 8888,
		middleware: function (connect, opt) {
			return [
				function(req, res, next){
					// treat POST request like GET during dev
					req.method = 'GET';
					return next();
				},
				st({
					path: 'doc',
					url: '/doc'
				})
			];
		}
	});
});



gulp.task('test', function(){
	return gulp.src('test/core/*.js')
		.pipe(ava({
			verbose: true
		}))
		.on('error', function(){
			process.exit(-1);
		})
	;
});



gulp.task('build', function(){
	sequence('test', 'js', 'examples-lib');
});

// don't test every dev change, to test result manually test, build or restart serve
gulp.task('watch-build', function(){
	sequence('js', 'examples-lib');
});



gulp.task('serve', ['build'], function(){
	sequence('server', 'watch');
});



gulp.task('doc', shell.task([
	'jsdoc -c jsdoc-conf.json'
]));



gulp.task('default', function(){
	sequence('build', 'doc');
});

var path = require('path');
var gulp = require('gulp');

var jsdoc = require("gulp-jsdoc");
var gutil = require('gulp-util');
var watch = require('gulp-watch')

var argv = require('optimist').argv;

var TEMPLATE_PATH = argv.t || 'node_modules/jaguarjs-jsdoc';
var OUTPUT_PATH = argv.d || './jsdoc_output';

var preprocessSource = function() {
  // you're going to receive Vinyl files as chunks
  function transform(file, cb) {
    gutil.log('Preprocessing:', file.path);
    // read and modify file contents
    var fileContents = String(file.contents);
    fileContents = fileContents.replace(/(import .*?;)\n/g,
      function(str, group1) {
        return 'jsio("' + group1 + '");';
      });
    file.contents = new Buffer(fileContents);

    // if there was some error, just pass as the first parameter here
    cb(null, file);
  }

  // returning the map will cause your transform function to be called
  // for each one of the chunks (files) you receive. And when this stream
  // receives a 'end' signal, it will end as well.
  //
  // Additionally, you want to require the `event-stream` somewhere else.
  return require('event-stream').map(transform);
};

var runJsdoc = function(src, output, templateObj) {
  gutil.log('*** Running jsDoc ***');
  gutil.log('Source:', src);
  gutil.log('Output:', output);

  // Run jsdoc!
  return gulp.src(src)
    .pipe(preprocessSource())
    .pipe(jsdoc.parser())
    .pipe(jsdoc.generator(output, templateObj));
};

// ~~ ~~ GULP TASKS ~~ ~~ //

/**
  * argv: c config, t template, d output
  */
gulp.task('jsdoc', [], function(cb) {
  // Check to make sure we have the required source.include
  if (!argv.c) {
    throw new Error('must specify command line option: -c');
  }

  var conf = require(argv.c);
  if (!conf.source || !conf.source.include) {
    throw new Error('conf.source.include not defined');
  }

  // Get the source array
  var srcDirs = conf.source.include;
  if (!Array.isArray(srcDirs)) {
    srcDirs = [srcDirs];
  }
  // Make all the sources relative to the conf!
  var confDir = path.dirname(argv.c);
  for (var i = 0; i < srcDirs.length; i++) {
    srcDirs[i] = path.join(confDir, srcDirs[i], '**/*.js');
  }

  // Template options
  if (!conf.templates) {
    throw new Error('conf.templates not defined');
    process.exit(20);
  }
  var templateObj = conf.templates;
  templateObj.path = TEMPLATE_PATH;

  return runJsdoc(srcDirs, OUTPUT_PATH, templateObj);
});

gulp.task('jsdoc-watch', [], function() {
  var srcDirs = argv.watch;

  if (!srcDirs) {
    throw new Error('Must specify command line argument at least once: --watch');
    process.exit(40);
  }

  var outputPath = OUTPUT_PATH;
  if (!Array.isArray(srcDirs)) {
    outputPath = path.join(srcDirs, '..', 'jsdoc_output');
    srcDirs = [srcDirs];
  }

  // Make sure we are only watching for js
  for (var i = 0; i < srcDirs.length; i++) {
    srcDirs[i] = path.join(srcDirs[i], '/**/*.js');
  }

  gutil.log('Running watch on:', srcDirs);

  var template = {
    path: TEMPLATE_PATH
  };

  var runFn = function () {
    runJsdoc(srcDirs, outputPath, template);
  };
  watch(srcDirs, runFn);
  runFn();
});

gulp.task('default', ['jsdoc'], function() {
});

var fs = require('fs');
var path = require('path');
var gulp = require('gulp');

var jsdoc = require("gulp-jsdoc");
var gutil = require('gulp-util');
var watch = require('gulp-watch')

var argv = require('optimist').argv;

var TEMPLATE_PATH = argv.t ? argv.t : path.join('node_modules', 'jaguarjs-jsdoc');
var OUTPUT_PATH = argv.d ? argv.d : './jsdoc_output';

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
  gutil.log('Template:', TEMPLATE_PATH);

  // Run jsdoc!
  return gulp.src(src)
    .pipe(preprocessSource())
    .pipe(jsdoc.parser())
    .pipe(jsdoc.generator(output, templateObj));
};

/** Verify that there is a readme in the srcArray, and try to find one if not.
    Edits srcArray in place. */
var verifyReadme = function(srcDirs, projectDir) {
  gutil.log('Verifying Readme');
  for (var i = 0; i < srcDirs.length; i++) {
    var fname = srcDirs[i];
    if (path.extname(fname) === '.md') {
      gutil.log('> Already added:', fname);
      return;
    }
  }

  // None found, look for a readme
  var files = fs.readdirSync(projectDir);
  for (var i = 0; i < files.length; i++) {
    var fname = files[i];
    if (path.extname(fname) === '.md' && /readme/i.test(fname)) {
      gutil.log('> Found:', fname);
      srcDirs.push(fname);
      return;
    }
  }

  gutil.log('> No readme could be found');
};

/** Adds proper globs to end of array entries. Edits srcDirs in place. */
var addJsGlob = function(srcDirs) {
  for (var i = 0; i < srcDirs.length; i++) {
    if (!path.extname(srcDirs[i])) {
      srcDirs[i] = path.join(srcDirs[i], '/**/*.js');
    }
  }
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

  // Verify that there is a readme
  var confDir = path.dirname(argv.c);
  verifyReadme(srcDirs, confDir);

  // Make all the sources relative to the conf!
  for (var i = 0; i < srcDirs.length; i++) {
    srcDirs[i] = path.join(confDir, srcDirs[i]);
  }
  addJsGlob(srcDirs);

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
  addJsGlob(srcDirs);

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

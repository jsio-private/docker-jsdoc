var gulp = require('gulp');
var jsdoc = require("gulp-jsdoc");
var gutil = require('gulp-util');
var path = require('path');

var argv = require('optimist').argv;

var preprocessSource = function() {
  // you're going to receive Vinyl files as chunks
  function transform(file, cb) {
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
  var sourceArray = conf.source.include;
  if (!Array.isArray(sourceArray)) {
    sourceArray = [sourceArray];
  }
  // Make all the sources relative to the conf!
  var confDir = path.dirname(argv.c);
  for (var i = 0; i < sourceArray.length; i++) {
    sourceArray[i] = path.join(confDir, sourceArray[i], '**/*.js');
  }
  gutil.log('Source:', sourceArray);

  // Template options
  if (!conf.templates) {
    throw new Error('conf.templates not defined');
    process.exit(2);
  }
  var templateObj = conf.templates;
  templateObj.path = argv.t || 'ink-docstrap';

  var output = argv.d || './out';

  // Run jsdoc!
  gulp.src(sourceArray)
    .pipe(preprocessSource())
    .pipe(jsdoc.parser())
    .pipe(jsdoc.generator(output, templateObj));
  cb();
});

gulp.task('default', ['jsdoc'], function() {
});

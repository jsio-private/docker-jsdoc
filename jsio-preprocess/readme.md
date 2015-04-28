# jsDoc for jsio

Simple gulp task for building pretty docs for javascript projects.

Custom logic to handle jsio projects containing `import xyz;` syntax.

### Development Usage

Highly recommended: [sublime-jsdocs](https://github.com/spadgos/sublime-jsdocs/)

Sometimes it is nice to see your docs before you push them to the live site.  There is a gulp task for this.  It will watch the specified folder, and build docs using the defualt template as changes are made.

If only one `--watch` is specified, the output directory will be one level up (in this example, `/path/to/devkit-scene/jsdoc_output`).

You can optionally use the `-d` argument, either to override the automatic or default output destination, or to define an output destination when using multible `--watch`.  The default output dir is `./jsdoc_output`.

Example usage:

	gulp jsdoc-watch \
		--watch /path/to/devkit-scene/src/

Example usage:

	gulp jsdoc-watch \
		--watch /path/to/devkit-scene/src/ \
		--watch /path/to/devkit-entities/src/ \
		-d /path/to/doc_output


### Container Usage

This project was originally intended to be used inside of a docker container, with a single command line call.

If there is not a markdown readme specified in the `conf.json` file, the gulp task will try to find a readme for the repository.

Command line arguments to help:

    -c <path>
        The path to the conf.json object for this project
    -t <dir>
        The directory for the jsdoc template for this project
    -d <dir>
        The directory for output website

Example usage:

    ./node_modules/gulp/bin/gulp.js \
        -c $INPUT_DIR/$CONFIG_FILE \
        -t $TEMPLATE_DIR \
        -d $OUTPUT_DIR

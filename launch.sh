#!/bin/bash
set -e

if [ -z "$GIT_REMOTE" ]; then
  echo "GIT_REMOTE is unset"
  exit 1
fi

if [ -z "$CONFIG_FILE" ]; then
  CONFIG_FILE=conf.json
fi

TEMPLATE_DIR=/jaguarjs-jsdoc

INPUT_DIR=/remote-app
OUTPUT_DIR=/doc-output

# Clone the repo
git clone $GIT_REMOTE $INPUT_DIR

(
  cd /jsio-preprocess

  # Run jsdoc
  ./node_modules/gulp/bin/gulp.js \
    -c $INPUT_DIR/$CONFIG_FILE \
    -t $TEMPLATE_DIR \
    -d $OUTPUT_DIR
)

# Complete
ls $OUTPUT_DIR

#!/bin/bash
set -e

## REQUIREMENTS ##
if [ -z "$GIT_REMOTE" ]; then
  echo "GIT_REMOTE is unset"
  exit 1
fi
if [ -z "$GIT_REF" ]; then
  echo "GIT_REF is unset"
  exit 1
fi
## ##

## OPTIONAL ##
if [ -z "$CONFIG_FILE" ]; then
  CONFIG_FILE="conf.json"
fi

OPTIONAL_ARGS=""
if [ "$TEMPLATE_DIR" ]; then
  OPTIONAL_ARGS="-t $TEMPLATE_DIR"
fi
## ##

INPUT_DIR="/remote-app"
OUTPUT_DIR="/doc-output"

# If the directory exists, make sure we reset it
if [ -d "$INPUT_DIR" ] && [ -d "$INPUT_DIR/.git" ]; then
  (
    cd $INPUT_DIR
    git reset --hard
    git pull --all
  )
else
  # Clone the repo
  git clone $GIT_REMOTE $INPUT_DIR
fi

# Checkout the proper ref
(
  cd $INPUT_DIR
  git checkout $GIT_REF
)

# Time to run the docs
(
  cd /jsio-preprocess

  # Run jsdoc
  ./node_modules/gulp/bin/gulp.js \
    -c $INPUT_DIR/$CONFIG_FILE \
    -d $OUTPUT_DIR \
    $OPTIONAL_ARGS

  # Upload!
  # TODO: at some point in time, the upload should happen from a secure location
  # ./node_modules/gulp/bin/gulp.js \
  #   -d $OUTPUT_DIR \
  #   upload
)

# Complete
ls $OUTPUT_DIR

#!/bin/bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
SSH_ID=~/.ssh/id_rsa

OPTIONAL_ARGS=""
if [ "$1" == "dev" ]; then
  echo "RUNNING IN DEV MODE"
  echo

  OPTIONAL_ARGS="-v $DIR/launch.sh:/launch.sh \
                 -v $DIR/jsio-preprocess/gulpfile.js:/jsio-preprocess/gulpfile.js"
fi

docker run -it \
  -v $SSH_ID:/root/.ssh/id_rsa \
  -v $DIR/test_output:/doc-output \
  -e GIT_REMOTE=git@github.com:gameclosure/devkit-effects \
  -e GIT_REF=master \
  $OPTIONAL_ARGS \
  jsdoc

#!/bin/bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
SSH_ID=~/.ssh/id_rsa

docker run -it \
  -v $SSH_ID:/root/.ssh/id_rsa \
  -v $DIR/test_output:/doc-output \
  -e GIT_REMOTE=git@github.com:gameclosure/devkit-effects \
  jsdoc

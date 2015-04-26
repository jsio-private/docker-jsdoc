# Docker container for running jsdoc on a git remote

Exmaple usage:

    docker run
      -v /path/to/id_rsa:/root/.ssh/id_rsa
      -v /path/to/output:/doc-output
      -e GIT_REMOTE=git@github.com:my/repository
      jsdoc

### Local Testing

Run `./test-container.sh` to test the container which has been built on your system already.

Run `./test-container.sh dev` to test the container with `launch` and `gulpfile` mounted in.

Note: You must have an ssh key at `~/.ssh/id_rsa`
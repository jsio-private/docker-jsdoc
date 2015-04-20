# Docker container for running jsdoc on a git remote

Exmaple usage:

    docker run
      -v /path/to/id_rsa:/root/.ssh/id_rsa
      -v /path/to/output:/doc-output
      -e GIT_REMOTE=git@github.com:my/repository
      jsdoc

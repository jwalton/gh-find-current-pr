#!/bin/bash

set -e

VERSION=$(node -e "console.log('v' + require('./package.json').version)")
MAJOR_VERSION=$(node -e "console.log('v' + require('./package.json').version.split('.')[0])")

echo "Retagging ${MAJOR_VERSION} to ${VERSION}"
git tag -d ${MAJOR_VERSION} && \
  git push --delete origin ${MAJOR_VERSION} && \
  git tag -a ${MAJOR_VERSION} -m ${VERSION} && \
  git push --follow-tags
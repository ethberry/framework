#!/usr/bin/env bash


echo -e "\033[34mTesting...\n\033[0m";

set -e # this will cause the shell to exit immediately if any command exits with a nonzero exit value.

export NODE_ENV=$NODE_ENV
export POSTGRES_URL=$POSTGRES_URL
export CHAIN_ID=$CHAIN_ID

lerna bootstrap --concurrency 1 --hoist

lerna exec --concurrency 1 -- npm run test
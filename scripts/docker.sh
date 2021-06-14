#!/usr/bin/env bash

echo -e "\033[34mDocker...\n\033[0m";

set -e # this will cause the shell to exit immediately if any command exits with a nonzero exit value.


# Stop all containers
docker-compose -f docker-compose.slim.yml down -v
# Stop all & delete all images for rebuild
docker-compose -f docker-compose.slim.yml down -v --rmi all

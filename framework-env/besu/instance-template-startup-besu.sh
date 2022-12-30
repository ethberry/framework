#!/bin/bash

sudo rm -f .env

sudo docker run -v /home/app:/home/app \
  --entrypoint gsutil voyz/gsutil_wrap \
  cp -r gs://framework-env/besu/* /home/app/

sudo -H -u app docker-credential-gcr configure-docker

sudo -H -u app docker run --rm \
    -v /var/run/docker.sock:/var/run/docker.sock \
    -v "/home/app:/home/app" \
    -w="/home/app" \
    docker/compose:1.24.0 -f docker-compose-besu.yml up -d

#sudo sh -c 'truncate -s 0 $(docker system info | grep "Docker Root Dir" | cut -d ":" -f2 | cut -d " " -f2-)/containers/*/*-json.log';
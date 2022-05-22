#!/bin/bash

sudo rm -rf nginx
sudo rm -f .env

sudo docker run -v /home/app:/home/app \
  --entrypoint gsutil voyz/gsutil_wrap \
  cp -r gs://framework-env/app/* /home/app/

sudo -H -u app docker-credential-gcr configure-docker
sudo sleep 30s
sudo -H -u app docker pull gcr.io/halogen-framing-335807/framework-img:latest
sudo sleep 10s
sudo -H -u app docker pull gcr.io/halogen-framing-335807/framework-img:latest

sudo -H -u app docker run --rm \
    -v /var/run/docker.sock:/var/run/docker.sock \
    -v "/home/app:/home/app" \
    -w="/home/app" \
    docker/compose:1.24.0 -f docker-compose-cloudbuild.yml up -d


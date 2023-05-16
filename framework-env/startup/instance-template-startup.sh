#!/bin/bash

sudo rm -rf nginx
sudo rm -f .env

sudo docker run -v /home/app:/home/app \
  --entrypoint gsutil voyz/gsutil_wrap \
  cp -r gs://framework-env/app/* /home/app/

sudo -H -u app docker-credential-gcr configure-docker
sudo sleep 90;

#image_time=$((($(date -d "now" +%s) - $(date --date=$(docker inspect --format='{{.Created}}' gcr.io/halogen-framing-335807/framework-img:latest) +%s)) / (60)))
#
#if ((image_time > 15)); then
#  echo 'awaiting docker Image to be pushed';
#  sudo sleep 240;
#fi

sudo -H -u app docker pull gcr.io/halogen-framing-335807/framework-img:latest

sudo -H -u app docker run --rm \
    -v /var/run/docker.sock:/var/run/docker.sock \
    -v "/home/app:/home/app" \
    -w="/home/app" \
    docker/compose:1.24.0 -f docker-compose-cloudbuild.yml up -d

#select pg_terminate_backend(pid) from pg_stat_activity where datname='framework'; drop database framework; create database framework;
#sudo journalctl -u google-startup-scripts.service
# if db cleaned, run core-eth after migrations done
sudo -H -u app docker run --rm \
    -v /var/run/docker.sock:/var/run/docker.sock \
    -v "/home/app:/home/app" \
    -w="/home/app" \
    docker/compose:1.24.0 -f docker-compose-cloudbuild.yml up -d core-eth
#select pg_terminate_backend(pid) from pg_stat_activity where datname="framework-development"; drop database "framework-development"; create database "framework-development";
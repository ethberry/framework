#!/usr/bin/env bash

echo -e "\033[34mEnvironment...\n\033[0m";

lerna exec --parallel --scope @trejgun/solo-public-api --scope @trejgun/solo-public-ui --scope @trejgun/solo-admin-api --scope @trejgun/solo-admin-ui --scope @trejgun/solo-emailer --scope @trejgun/solo-webhooks -- cp -rf .env.sample .env.development
lerna exec --parallel --scope @trejgun/solo-public-api --scope @trejgun/solo-public-ui --scope @trejgun/solo-admin-api --scope @trejgun/solo-admin-ui --scope @trejgun/solo-emailer --scope @trejgun/solo-webhooks -- cp -rf .env.sample .env.test
lerna exec --parallel --scope @trejgun/solo-public-api --scope @trejgun/solo-public-ui --scope @trejgun/solo-admin-api --scope @trejgun/solo-admin-ui --scope @trejgun/solo-emailer --scope @trejgun/solo-webhooks -- cp -rf .env.sample .env.production


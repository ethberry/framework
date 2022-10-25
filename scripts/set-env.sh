#!/bin/sh

set -e # this will cause the shell to exit immediately if any command exits with a nonzero exit value.

if [ $1 == "clean" ]; then
echo "\033[34m DELETE PRODuction env files in the services folders!\n\033[0m"

rm ./services/public-api/.env.production
rm ./services/public-ui/.env.production
rm ./services/admin-api/.env.production
rm ./services/admin-ui/.env.production
rm ./services/emailer/.env.production

echo "\033[34m Done!\n\033[0m"

fi;


if [ -f .env ]
then
  export $(cat .env | sed 's/#.*//g' | xargs)

echo "\033[34mSetting-Up env files in the services folders...\n\033[0m"

touch ./services/admin-api/.env.production
  echo NODE_ENV=$NODE_ENV >>./services/admin-api/.env.production
  echo HOST=$HOST >>./services/admin-api/.env.production
  echo PORT=$PORT_ADMIN_API >>./services/admin-api/.env.production
  echo ADMIN_FE_URL=$ADMIN_FE_URL >>./services/admin-api/.env.production
  echo POSTGRES_URL=postgres://$POSTGRES_USER:$POSTGRES_PASSWORD@$POSTGRES_HOST/$POSTGRES_DB >>./services/admin-api/.env.production
  echo REDIS_THROTTLE_URL=$REDIS_THROTTLE_URL >>./services/admin-api/.env.production
  echo THROTTLE_TTL=$THROTTLE_TTL >>./services/admin-api/.env.production
  echo THROTTLE_LIMIT=$THROTTLE_LIMIT >>./services/admin-api/.env.production
  echo RMQ_URL=$RMQ_URL >>./services/admin-api/.env.production
  echo RMQ_QUEUE_EMAIL=$RMQ_QUEUE_EMAIL >>./services/admin-api/.env.production
  echo RMQ_QUEUE_WAREHOUSE=$RMQ_QUEUE_WAREHOUSE >>./services/admin-api/.env.production
  echo GOOGLE_CLIENT_ID=$GOOGLE_CLIENT_ID >>./services/admin-api/.env.production
  echo GOOGLE_CLIENT_SECRET=$GOOGLE_CLIENT_SECRET >>./services/admin-api/.env.production
  echo GOOGLE_CALLBACK_URL=$GOOGLE_CALLBACK_URL >>./services/admin-api/.env.production
  echo FACEBOOK_CLIENT_ID=$FACEBOOK_CLIENT_ID >>./services/admin-api/.env.production
  echo FACEBOOK_CLIENT_SECRET=$FACEBOOK_CLIENT_SECRETL >>./services/admin-api/.env.production
  echo FACEBOOK_CALLBACK_URL=$FACEBOOK_CALLBACK_URL >>./services/admin-api/.env.production
  echo PASSWORD_SECRET=$PASSWORD_SECRET >>./services/admin-api/.env.production
  echo LOGDNA_INGESTION_KEY=LOGDNA_INGESTION_KEY >>./services/admin-api/.env.production

touch ./services/admin-ui/.env.production
  echo HOST=$HOST >>./services/admin-ui/.env.production
  echo PORT=$PORT_ADMIN_UI >>./services/admin-ui/.env.production
  echo BE_URL=$ADMIN_BE_URL >>./services/admin-ui/.env.production
  echo GOOGLE_ANALYTICS=$GOOGLE_ANALYTICS >> ./services/admin-ui/.env.production
  echo FIREBASE_API_KEY=$FIREBASE_API_KEY >>./services/admin-ui/.env.production
  echo FIREBASE_AUTH_DOMAIN=$FIREBASE_AUTH_DOMAIN >>./services/admin-ui/.env.production
  echo FIREBASE_DB_URL=$FIREBASE_DB_URL >>./services/admin-ui/.env.production
  echo FIREBASE_PROJECT_ID=$FIREBASE_PROJECT_ID >>./services/admin-ui/.env.production
  echo FIREBASE_STORAGE_BUCKET=$FIREBASE_STORAGE_BUCKET >>./services/admin-ui/.env.production
  echo FIREBASE_MESSAGE_SENDER_ID=$FIREBASE_MESSAGE_SENDER_ID >>./services/admin-ui/.env.production
  echo FIREBASE_APP_ID=$FIREBASE_APP_ID >>./services/admin-ui/.env.production
  echo FIREBASE_MEASUREMENT_ID=$FIREBASE_MEASUREMENT_ID >>./services/admin-ui/.env.production

touch ./services/public-api/.env.production
  echo NODE_ENV=$NODE_ENV >>./services/public-api/.env.production
  echo HOST=$HOST >>./services/public-api/.env.production
  echo PORT=$PORT_PUBLIC_API >>./services/public-api/.env.production
  echo PUBLIC_FE_URL=$PUBLIC_FE_URL >>./services/public-api/.env.production
  echo POSTGRES_URL=postgres://$POSTGRES_USER:$POSTGRES_PASSWORD@$POSTGRES_HOST/$POSTGRES_DB >>./services/public-api/.env.production
  echo REDIS_THROTTLE_URL=$REDIS_THROTTLE_URL >>./services/public-api/.env.production
  echo THROTTLE_TTL=$THROTTLE_TTL >>./services/public-api/.env.production
  echo THROTTLE_LIMIT=$THROTTLE_LIMIT >>./services/public-api/.env.production
  echo RMQ_URL=$RMQ_URL >>./services/public-api/.env.production
  echo RMQ_QUEUE_EMAIL=$RMQ_QUEUE_EMAIL >>./services/public-api/.env.production
  echo RMQ_QUEUE_WAREHOUSE=$RMQ_QUEUE_WAREHOUSE >>./services/public-api/.env.production
  echo GOOGLE_CLIENT_ID=$GOOGLE_CLIENT_ID >>./services/public-api/.env.production
  echo GOOGLE_CLIENT_SECRET=$GOOGLE_CLIENT_SECRET >>./services/public-api/.env.production
  echo GOOGLE_CALLBACK_URL=$GOOGLE_CALLBACK_URL >>./services/public-api/.env.production
  echo FACEBOOK_CLIENT_ID=$FACEBOOK_CLIENT_ID >>./services/public-api/.env.production
  echo FACEBOOK_CLIENT_SECRET=$FACEBOOK_CLIENT_SECRETL >>./services/public-api/.env.production
  echo FACEBOOK_CALLBACK_URL=$FACEBOOK_CALLBACK_URL >>./services/public-api/.env.production
  echo PASSWORD_SECRET=$PASSWORD_SECRET >>./services/public-api/.env.production
  echo LOGDNA_INGESTION_KEY=LOGDNA_INGESTION_KEY >>./services/public-api/.env.production

touch ./services/public-ui/.env.production
  echo HOST=$HOST >>./services/public-ui/.env.production
  echo PORT=$PORT_PUBLIC_UI >>./services/public-ui/.env.production
  echo BE_URL=$PUBLIC_BE_URL >>./services/public-ui/.env.production
  echo GOOGLE_ANALYTICS=$GOOGLE_ANALYTICS >> ./services/public-ui/.env.production
  echo FIREBASE_API_KEY=$FIREBASE_API_KEY >>./services/public-ui/.env.production
  echo FIREBASE_AUTH_DOMAIN=$FIREBASE_AUTH_DOMAIN >>./services/public-ui/.env.production
  echo FIREBASE_DB_URL=$FIREBASE_DB_URL >>./services/public-ui/.env.production
  echo FIREBASE_PROJECT_ID=$FIREBASE_PROJECT_ID >>./services/public-ui/.env.production
  echo FIREBASE_STORAGE_BUCKET=$FIREBASE_STORAGE_BUCKET >>./services/public-ui/.env.production
  echo FIREBASE_MESSAGE_SENDER_ID=$FIREBASE_MESSAGE_SENDER_ID >>./services/public-ui/.env.production
  echo FIREBASE_APP_ID=$FIREBASE_APP_ID >>./services/public-ui/.env.production
  echo FIREBASE_MEASUREMENT_ID=$FIREBASE_MEASUREMENT_ID >>./services/public-ui/.env.production

touch ./services/emailer/.env.production
  echo HOST=$HOST >>./services/emailer/.env.production
  echo PORT=$PORT_EMAILER >>./services/emailer/.env.production
  echo RMQ_URL=$RMQ_URL >>./services/emailer/.env.production
  echo RMQ_QUEUE_EMAIL=$RMQ_QUEUE_EMAIL >>./services/emailer/.env.production
  echo LOGDNA_INGESTION_KEY=LOGDNA_INGESTION_KEY >>./services/emailer/.env.production


echo "\033[34mAll done!\n\033[0m"

fi;

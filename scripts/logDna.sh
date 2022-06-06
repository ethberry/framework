#!/usr/bin/env bash

echo "Static mounted"
echo "Sending log to logDNA.."

echo "\n"

curl "https://logs.logdna.com/logs/ingest?hostname=$(hostname)&now=$(date +%s)" \
-u $LOGDNA_INGESTION_KEY: \
-H "Content-Type: application/json; charset=UTF-8" \
-d \
'{
   "lines": [
     {
       "line":"'${BASE_APP}' static files mounted",
       "app":"'${BASE_APP}'",
       "level": "INFO",
       "env": "'${BASE_MODE}'"
     }
   ]
}'

echo "\n"

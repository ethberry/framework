FROM solo-packages:latest

EXPOSE 3001 3002 3003 3004 3005

WORKDIR /home/node/solo

CMD npm run start

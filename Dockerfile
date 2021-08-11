FROM framework-packages:latest

EXPOSE 3001 3002 3003 3004 3005

WORKDIR /home/node/framework

CMD npm run start

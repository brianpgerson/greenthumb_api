FROM node:12.18-alpine3.12

COPY $PWD /home/node/greenthumb

WORKDIR /home/node/greenthumb

RUN npm install;

RUN npm run migrate;

EXPOSE 1337

CMD ["/bin/sh", "-c", "npm run start"]
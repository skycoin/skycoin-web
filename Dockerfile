FROM node:8-alpine

COPY . /usr/src/skycoin-web

WORKDIR /usr/src/skycoin-web

RUN npm install -g @angular/cli \
    && npm install -g yarn \
    && yarn \
    && npm run build

EXPOSE 4200

ENTRYPOINT  ["npm", "start"]

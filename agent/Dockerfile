FROM node:boron

WORKDIR /usr/src/app

COPY package.json /usr/src/app
COPY tsconfig.json /usr/src/app

RUN npm install -g tsc typescript tslint
RUN npm install

COPY . /usr/src/app

RUN tsc --target es2015

CMD node ./build/server.js
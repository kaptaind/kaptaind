FROM node:boron

WORKDIR /usr/src/app

COPY package.json /usr/src/app
COPY tsconfig.json /usr/src/app

RUN npm install -g tsc typescript tslint angular-cli
RUN npm install

COPY . /usr/src/app

RUN npm install ./src/ui
RUN tsc --target es2015

EXPOSE 3000
CMD node ./build/server.js
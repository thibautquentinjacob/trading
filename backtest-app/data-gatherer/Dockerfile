FROM node:10.22.0-alpine3.10

WORKDIR /usr/src/server
COPY package.json package.json
COPY tsconfig.json tsconfig.json
RUN npm install

COPY src src

RUN npm run build

RUN rm -Rf src tsconfig.json
CMD ["npm", "start"]
FROM node:10.22.0-alpine3.10

WORKDIR /usr/src/server
COPY package.json package.json
COPY tsconfig.json tsconfig.json
RUN npm install -g typescript && \
    npm install

COPY tulind node_modules/@types/tulind
COPY src src

RUN npm run build

COPY dist dist

RUN rm -Rf src tsconfig.json
CMD ["npm", "start"]
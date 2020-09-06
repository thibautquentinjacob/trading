FROM node:latest as node

WORKDIR /tmp/build

COPY . .
RUN npm install -g typescript && \
    npm install && \
    npm run ng build --prod

FROM nginx:latest

WORKDIR /usr/share/nginx/html
COPY --from=node /tmp/build/dist/backtest-app /usr/share/nginx/html

RUN rm -Rf /tmp/build

COPY nginx.conf /etc/nginx/conf.d/nginx.conf

FROM node:14.16.0-buster as build
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY package.json ./
COPY yarn.lock ./
RUN yarn
RUN yarn add expo-cli
COPY App.tsx ./
COPY app.json ./
COPY assets ./assets
COPY babel.config.js ./
COPY globals.js ./
COPY scripts ./scripts
COPY src ./src
COPY tsconfig.json ./
COPY tslint.json ./
COPY web ./web
RUN expo build:web

FROM nginx
COPY --from=build /app/web-build /usr/share/nginx/html
EXPOSE 80

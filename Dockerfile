FROM node:18 as base
WORKDIR /app
COPY package*.json ./
RUN npm i
COPY . .

RUN npm run build

RUN rm -rf node_modules

FROM base as production

COPY --from=base ./app/dist ./dist

COPY package*.json .

ENV NODE_PATH=./dist

EXPOSE 8080

CMD [ "node", "./src/server.js" ]
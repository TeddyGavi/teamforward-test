FROM node:18 as base
WORKDIR /app
COPY package*.json ./
COPY . .

RUN npm i
RUN npm run build

FROM base as production

COPY --from=base ./app/dist ./dist

COPY package*.json .

ENV NODE_PATH=./dist

EXPOSE 8080

# CMD [ "node", "./src/server.js" ]
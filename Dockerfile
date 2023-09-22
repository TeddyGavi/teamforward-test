FROM node:18 as base
# Create app directory
WORKDIR /app
# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm i
# If you are building your code for production
# RUN npm ci --omit=dev
# Bundle app source
COPY . .

FROM base as production

ENV NODE_PATH=./dist

# EXPOSE 8080

RUN npm run build

# CMD [ "node", "./src/server.js" ]
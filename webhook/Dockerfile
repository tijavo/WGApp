FROM node:current-alpine3.22

WORKDIR /app

# Docker CLI installieren für Container-Management
RUN apk add --no-cache docker-cli git

COPY package.json package-lock.json ./
RUN npm install

COPY . .

EXPOSE 9000

CMD ["node", "webhook-server.js"]
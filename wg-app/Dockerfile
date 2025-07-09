# Multi-stage build für Vue.js
FROM node:current-alpine3.22 as build-stage

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

# Production stage mit Nginx
FROM nginx:alpine as production-stage

# Vue.js build kopieren
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Nginx config für SPA
RUN echo 'server { \
    listen 80; \
    server_name localhost; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
    gzip on; \
    gzip_types text/css application/javascript text/javascript; \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
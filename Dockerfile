# Etapa de construcción
FROM node:18 as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY ./ .
RUN npm run build

# Etapa de producción
FROM nginx:stable-alpine3.17 as production-stage
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY --from=build-stage /app/dist /app
COPY nginx.conf /etc/nginx/nginx.conf



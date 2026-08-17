# syntax=docker/dockerfile:1

ARG NODE_VERSION=22

# Vite/TypeScript build stage.
FROM node:${NODE_VERSION}-bookworm-slim AS build
WORKDIR /app

RUN corepack enable

COPY package.json yarn.lock .yarnrc.yml ./
RUN yarn install --immutable --inline-builds

COPY . .

# Chỉ public URL/publishable values được phép dùng VITE_*.
ARG VITE_API_URL=/api
ENV VITE_API_URL=${VITE_API_URL}

RUN yarn build

# React/Vite production output là static files, phục vụ bằng Nginx.
FROM nginx:stable-alpine AS runtime
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget -qO- http://127.0.0.1/ >/dev/null || exit 1

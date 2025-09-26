# --- Build stage ---
FROM node:18-alpine AS build
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install --frozen-lockfile || npm install
COPY . .
RUN npm run build

# --- Production stage (static file server) ---
FROM nginx:1.27-alpine
COPY --from=build /app/dist /usr/share/nginx/html
# Nginx listens on 80 by default
EXPOSE 80
# Simple healthcheck (optional)
HEALTHCHECK CMD wget -qO- http://localhost/ || exit 1


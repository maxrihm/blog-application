# ---- Base Node ----
FROM node:14 AS base
WORKDIR /app
COPY package*.json ./

# ---- Dependencies ----
FROM base AS dependencies
RUN npm install

# ---- Copy Files/Build ----
FROM dependencies AS build
COPY . ./
RUN npm run build

# ---- Release with Nginx ----
FROM nginx:alpine AS release
COPY --from=build /app/build /usr/share/nginx/html
# Copy the default nginx.conf (optional)
COPY nginx.conf /etc/nginx/conf.d/default.conf
CMD ["nginx", "-g", "daemon off;"]

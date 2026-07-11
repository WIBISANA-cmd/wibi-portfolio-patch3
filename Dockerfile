FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

ARG VITE_SANITY_PROJECT_ID
ARG VITE_SANITY_DATASET=production
ARG VITE_SANITY_API_VERSION=2024-10-01

ENV VITE_SANITY_PROJECT_ID=$VITE_SANITY_PROJECT_ID
ENV VITE_SANITY_DATASET=$VITE_SANITY_DATASET
ENV VITE_SANITY_API_VERSION=$VITE_SANITY_API_VERSION

RUN npm run build

FROM nginx:1.27-alpine AS runner

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html
COPY docker-entrypoint.d/40-runtime-env.sh /docker-entrypoint.d/40-runtime-env.sh

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

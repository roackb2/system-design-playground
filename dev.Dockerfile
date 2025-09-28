FROM node:20-bullseye-slim
WORKDIR /app
ENV NODE_ENV=development
ENV CHOKIDAR_USEPOLLING=true
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 make g++ \
 && rm -rf /var/lib/apt/lists/*
COPY package.json yarn.lock ./
RUN corepack enable && yarn config set nodeLinker node-modules && yarn install
VOLUME ["/app/node_modules"]
EXPOSE 3300
CMD ["yarn","dev"]

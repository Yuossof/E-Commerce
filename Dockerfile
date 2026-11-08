FROM node:22-bookworm-slim

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY tsconfig.json ./
COPY src ./src
COPY migrations ./migrations
COPY run-migration.ts ./

RUN npm run build

EXPOSE 8090

CMD ["sh", "-c", "npm run db:migrate && npm start"]

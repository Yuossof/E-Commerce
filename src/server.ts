import "dotenv/config";

import app from "./app";

import config from "./config/env";

import { connectToRedis } from "./config/redis";
import { rabbitMQ } from "./config/rabbitmq";

async function startServer() {
  try {
    await connectToRedis()
    await rabbitMQ.connect()
  } catch (error) {
    process.exit(1);
  }

  const server = app.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
  });

  server.on("error", (error) => {
    console.error("Failed to start HTTP server:", error);
    process.exit(1);
  });
}

startServer();
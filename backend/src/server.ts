import { createServer } from "http";
import app from "./app";
import { connectDB } from "./config/db";
import { env } from "./config/env";
import logger from "./config/logger";

const PORT = env.BACKEND_PORT || 4000;

async function start() {
  try {
    await connectDB();
    const server = createServer(app);

    server.listen(PORT, () => {
      logger.info(`Backend running on http://localhost:${PORT}`);
    });
  } catch (err) {
    logger.error("Failed to start server", { err });
    process.exit(1);
  }
}

start();
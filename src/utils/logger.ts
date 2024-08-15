import pino from "pino";

export const logger = pino({
  redact: ["DB_CONNECTION"],
  level: "debug",
  transport: {
    target: "pino-pretty",
  },
});

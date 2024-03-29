import { createLogger, format, transports } from 'winston';

const { combine, timestamp, printf } = format;

const logFormat = printf(
  ({ level, message, timestamp }) => `[${timestamp}] ${level}: ${message}`,
);

export const logger = createLogger({
  format: combine(timestamp(), logFormat),
  transports: [
    new transports.Console({
      level: 'error',
    }),
    new transports.File({
      filename: 'error.log',
      level: 'error',
    }),
  ],
});

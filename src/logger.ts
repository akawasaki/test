import { createLogger, format, transports } from 'winston';

const { label, combine, timestamp, prettyPrint } = format;
export const logger = createLogger({
  level: 'info',
  format: combine(timestamp(), prettyPrint()),
  transports: [new transports.Console()],
});

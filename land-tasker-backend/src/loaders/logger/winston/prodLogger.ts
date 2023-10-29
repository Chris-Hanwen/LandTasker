import winston, { format, createLogger } from 'winston';
import path from 'path';
const { timestamp, combine, align, printf } = format;

function buildProdLogger() {
  return createLogger({
    format: combine(
      timestamp({
        format: 'YYYY-MM-DD hh:mm:ss A',
      }),
      align(),
      printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`),
    ),
    transports: [
      new winston.transports.File({
        filename: path.join('storage/logs', '/logger.log'),
      }),
    ],
  });
}

export default buildProdLogger;

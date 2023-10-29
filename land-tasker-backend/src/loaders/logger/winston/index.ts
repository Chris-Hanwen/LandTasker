import buildDevLogger from './devLogger';
import buildProdLogger from './prodLogger';

let logger = null;

if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'dev') {
  logger = buildDevLogger();
} else {
  logger = buildProdLogger();
}

export default logger;

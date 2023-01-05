const winston = require('winston');
const { APP_ENV } = require('./properties-loader');

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};

const appLevel = () => {
  const env = APP_ENV;
  return env === 'dev' ? 'debug' : 'info';
};

winston.addColors(colors);

const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD hh:mm:ss:SSS A' }),
  winston.format.printf(({
    timestamp, level, message, ...data
  }) => JSON.stringify({
    timestamp, level, message, data,
  }, null, 2)),
);

const transports = [
  new winston.transports.Console({
    format: winston.format.combine(winston.format.colorize({ all: true })),
  }),
];

const logger = winston.createLogger({
  level: appLevel(),
  levels,
  format,
  transports,
});

module.exports = logger;

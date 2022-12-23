import winston from 'winston';
import props from './properties-loader';

const { APP_ENV, LOGS_BASE_FOLDER } = props;

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

const level = (): string => {
  const env = APP_ENV;
  return env === 'dev' ? 'debug' : 'info';
};

winston.addColors(colors);

const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD hh:mm:ss:SSS A' }),
  winston.format.printf((info) => `${String(info.timestamp)} ${info.level}: ${String(info.message)}`)
);

const transports = [
  new winston.transports.Console({
    format: winston.format.combine(winston.format.colorize({ all: true })),
  }),
  new winston.transports.File({ filename: `${LOGS_BASE_FOLDER}/accounts.log`, format: winston.format.json() }),
];

const logger = winston.createLogger({
  level: level(),
  levels,
  format,
  transports,
});

export default logger;

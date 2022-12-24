import winston from 'winston';
import props from './properties-loader';

const { combine, timestamp, printf, colorize } = winston.format;
const { APP_ENV } = props;

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

const format = combine(
  timestamp({ format: 'YYYY-MM-DD hh:mm:ss:SSS A' }),
  printf(({ timestamp, level, message, ...data }) => JSON.stringify({ timestamp, level, message, data }, null, 2))
);

const transports = [
  new winston.transports.Console({
    format: combine(colorize({ all: true })),
  }),
];

const logger = winston.createLogger({
  level: level(),
  levels,
  format,
  transports,
});

export default logger;

import pino from "pino";

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: {
    targets: [{
      target: 'pino/file',
      options: {
        destination: 1, // write to stdout
      }
    }, {
      target: 'pino/file',
      options: {
        destination: 'logs/app.json', // write to log file for filebeat to harvest
      }
    }]
  }
})
logger.info('logger initialized')

export default logger;

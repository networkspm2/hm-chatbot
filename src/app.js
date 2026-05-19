const Fastify = require('fastify');
const healthRoutes = require('./routes/health');
const webhookRoutes = require('./routes/webhook');

function buildApp(opts = {}) {
  const isDev = process.env.NODE_ENV !== 'production';

  let loggerConfig;
  if (isDev) {
    try {
      require('pino-pretty');
      loggerConfig = { transport: { target: 'pino-pretty', options: { colorize: true } } };
    } catch {
      loggerConfig = true;
    }
  } else {
    loggerConfig = true;
  }

  const app = Fastify({
    logger: loggerConfig,
    ...opts,
  });

  app.register(healthRoutes);
  app.register(webhookRoutes);

  return app;
}

module.exports = buildApp;

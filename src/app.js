const Fastify = require('fastify');
const healthRoutes = require('./routes/health');
const webhookRoutes = require('./routes/webhook');

function buildApp(opts = {}) {
  const isDev = process.env.NODE_ENV !== 'production';

  const app = Fastify({
    logger: isDev
      ? { transport: { target: 'pino-pretty', options: { colorize: true } } }
      : true,
    ...opts,
  });

  app.register(healthRoutes);
  app.register(webhookRoutes);

  return app;
}

module.exports = buildApp;

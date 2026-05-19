async function webhookRoutes(fastify) {
  fastify.get('/webhook/meta', async (request, reply) => {
    const mode = request.query['hub.mode'];
    const token = request.query['hub.verify_token'];
    const challenge = request.query['hub.challenge'];

    if (mode === 'subscribe' && token === process.env.META_VERIFY_TOKEN) {
      fastify.log.info('Meta webhook verified successfully');
      return reply.status(200).send(challenge);
    }

    fastify.log.warn({ mode, token }, 'Meta webhook verification failed');
    return reply.status(403).send({ error: 'Forbidden' });
  });

  fastify.post('/webhook/meta', async (request, reply) => {
    console.log('Webhook body received:\n', JSON.stringify(request.body, null, 2));
    return reply.status(200).send({ received: true });
  });
}

module.exports = webhookRoutes;

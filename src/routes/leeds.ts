import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

const leeds = async (app: FastifyInstance) => {
  app.get('/', (req: FastifyRequest, res: FastifyReply) => {
    res.send('Hello World');
  });
};

export default leeds;

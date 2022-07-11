const Hapi = require('@hapi/hapi');
const routes = require('./routes');

const init = async () => {
  const PORT = 5000;
  const HOST = 'localhost';

  const server = Hapi.server({
    port: PORT,
    host: HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  server.route(routes);

  await server.start();
  console.log(`Server running on port ${PORT}`);
};

init();

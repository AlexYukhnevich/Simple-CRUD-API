import createServer from './server';

const app = createServer();
const server = app.listenServer();

process.on('unhandledRejection', console.error);
process.on('uncaughtException', console.error);

export { server };

import express from 'express';
import routes from './routes';
import './database';

class App {
  constructor() {
    this.server = express();

    this.middlewares();
    this.routes();
  }

  // carrega os middlewares globais
  middlewares() {
    this.server.use(express.json());
  }

  // carrega as rotas
  routes() {
    this.server.use(routes);
  }
}

export default new App().server;

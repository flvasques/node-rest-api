import { Contato } from './models/contato';
import  express from 'express';
import { index } from './routes/index';
import cors from 'cors';
import connection from './bdConfig';
import { User } from './models/user';
require('dotenv').config();
export class App {
  public server;

  constructor() {
    this.server = express();
    this.middleware();
    this.router();
    this.startDb();
  }

  private middleware(): void {
    const options: cors.CorsOptions = {
        allowedHeaders: [
          'Origin',
          'X-Requested-With',
          'Content-Type',
          'Accept',
          'X-Access-Token',
        ],
        credentials: true,
        methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
        origin: '*',
        preflightContinue: false,
      };
    this.server.use(express.json());
    this.server.use(express.urlencoded({ extended: true }));
    this.server.use(cors<express.Request>(options));1
  }

  private router(): void {
    this.server.use('/api', index);
    this.server.use(function (req: any, res: any, next: any) {
      const err: any = new Error("Not Found");
      err.status = 404;
      return res.status(404).json("Não encontrado");
    });
  }

  private startDb() {
    (async () => {
      try {
          await connection;
          connection.connect.addModels([User, Contato]);
          connection.connect.sync();
          console.log('Conexão relizada con sucesso');
      } catch (error) {
          console.error('Conexão não realizada:', error);
      }
  })();
  }

  public start(): void {
    const port = process.env.PORT;
    this.server.listen(port, () => {
        console.log(`Listen at ${port}`);
    });
  }
}


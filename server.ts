import * as express from 'express';
import { Express } from 'express';
import { join } from 'path';
import * as http from 'http';
import * as bodyParser from 'body-parser';

import { ILogger, Logger } from './src/api/libs';
import { IRequest, IServer } from './src/models';
import { sessionService, socketService, authService, dataService } from './src/api/services/core';
import { UserCtrl } from './src/api/controllers';

const DEFAULT_PORT = 3000;

export class App implements IServer {
  app: Express;
  http: http.Server;
  log: ILogger = new Logger('APP');

  private port = process.env.PORT || DEFAULT_PORT;

  constructor() {
    this.app = express();
    this.http = http.createServer(this.app);
  }

  public async run() {
    const canRun = await this.initServices();

    if (!canRun) {
      this.log.error(`Server can't be run`);
      return;
    }

    this.config();
    this.route();

    this.http.listen(this.port, () => {
      this.log.success(`Server listening on http://localhost:${this.port}`);
    });
  }

  private config() {
    this.app.use(require('cookie-parser')());
    this.app.use(bodyParser.urlencoded({extended: true}));
    this.app.use(bodyParser.json());
    this.app.use((req, res, next) => {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-auth-token");
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
      res.setHeader('Access-Control-Allow-Credentials', 'true');
      next();
    });

    this.app.use('/assets', express.static(join(process.cwd(), 'assets')));
    this.app.use('/dist', express.static(join(process.cwd(), 'dist')));

    this.app.use(sessionService.sessionMiddleware);
    socketService.config(sessionService.sessionMiddleware);
  }

  private route() {
    authService.route(this);

    this.app.get('/', authService.isAuthorised('/login'), (req, res) => {
      res.sendFile(__dirname + '/src/client/index.html');
    });

    this.app.get('/login', (req, res) => {
      res.sendFile(__dirname + '/src/client/login.html');
    });

    UserCtrl.init(this);

  }

  private async initServices() {
    const initialisedServices = await Promise.all([
      dataService.initialise(),
      authService.initialise(),
      socketService.initialise(this),
      sessionService.initialise(this)
    ]);

    return initialisedServices.reduce((acc, curr) => curr && acc, true);
  }
}

const app = new App();
app.run();
process.on('uncaughtException', (err) => {
  app.log.error(`uncaughtException: ${err.message}`, err.stack);
});
process.on('unhandledRejection', (err: Error) => {
  app.log.error(`unhandledRejection`, err.message || err);
});

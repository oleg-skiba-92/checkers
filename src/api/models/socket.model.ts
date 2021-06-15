import * as io from 'socket.io';
import { IncomingMessage } from 'http';

import { ISession } from './app.model';

export interface ISocket extends io.Socket {
  request: IncomingMessage & {session: ISession};
}

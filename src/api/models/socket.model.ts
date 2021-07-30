import * as io from 'socket.io';

import { IAuthData } from '../features/auth/auth.model';

export interface ISocket extends io.Socket {
  authData?: IAuthData;
}

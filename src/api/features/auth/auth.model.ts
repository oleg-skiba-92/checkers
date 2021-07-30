import { IUserInfo } from '../../../models';
import { IApiResponseError } from '../../common/response/api-response.model';
import { IInitializedService, IRequest } from '../../models/app.model';

export enum EAuthMethod {
  Google,
  Password,
  Guest,
}

export interface IGoogleUserInfo {
  id: string;
  email: string;
  picture: string;
  name: string;
}

export interface IAuthData {
  userId: string;
  userName: string;
  loginMethod: EAuthMethod;
}

export interface IParsedToken {
  valid: boolean;
  payload: IAuthData | IApiResponseError
}

export interface IAuthService extends IInitializedService {
  googleAuthUrl(): string;

  authenticateGoogle(code: string): Promise<IGoogleUserInfo>;

  login(user: IUserInfo, loginMethod: EAuthMethod, req: IRequest): string;

  logout(req: IRequest): void;
}

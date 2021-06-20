import { ILoginRequest, IRegistrationRequest, IUserInfo } from '../../../models';
import { IBaseCtrl } from '../../common/controller/controller.model';
import { IApiResponse } from '../../common/response/api-response.model';
import { IInitializedService, IRequest, TMiddleware } from '../../models/app.model';

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

export interface IAuthService extends IInitializedService {
  googleAuthUrl(): string;

  authenticateGoogle(code: string): Promise<IGoogleUserInfo>;

  isAuthorised(redirectPath: string): TMiddleware;

  login(user: IUserInfo, loginMethod: EAuthMethod, req: IRequest): void;

  logout(req: IRequest): void;
}

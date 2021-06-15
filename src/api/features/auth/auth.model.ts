import { ILoginRequest, IRegistrationRequest } from '../../../models';
import { IBaseCtrl } from '../../common/controller/controller.model';
import { IApiResponse } from '../../common/response/api-response.model';
import { IUserInfo } from '../user/user.model';
import { IInitializedService, IRequest, TMiddleware } from '../../models/app.model';

export enum EAuthMethod {
  Google,
  Password
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

export interface IAuthCtrl extends IBaseCtrl {
  getGoogleAuthUrl(): Promise<IApiResponse>;

  googleCallback(data: { code: string }, req: IRequest): Promise<IApiResponse>;

  registration(data: ILoginRequest, req: IRequest): Promise<IApiResponse>;

  login(data: IRegistrationRequest, req: IRequest): Promise<IApiResponse>;

  logout(data: null, req: IRequest): Promise<IApiResponse>;
}

export interface IAuthService extends IInitializedService {
  googleAuthUrl(): string;

  authenticateGoogle(code: string): Promise<IGoogleUserInfo>;

  isAuthorised(redirectPath: string): TMiddleware;

  login(user: IUserInfo, loginMethod: EAuthMethod, req: IRequest): void;

  logout(req: IRequest): void;
}

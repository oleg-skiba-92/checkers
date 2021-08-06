//#region enums
export const enum EAPIEndpoints {
  Api = 'api',
  Auth = 'auth',
  User = 'user',
  Me = 'me',
  Google = 'google',
  GoogleCallback = 'google/callback',
  Registration = 'registration',
  Login = 'login',
  LoginAsGuest = 'login-as-guest',
  Logout = 'logout',
  RefreshToken = 'token',
}

//#endregion enums

export type TSimpleCallback = () => void;
export type TSimpleDataCallback<T> = (data: T) => void;

//#region enums
export const enum EApiErrorCode {
  InvalidData = 'INVALID_DATA',
  NotFound = 'NOT_FOUND',
  Unknown = 'UNKNOWN',

  NoToken = 'NO_TOKEN',
  ParseToken = 'PARSE_TOKEN',
  TokenExpired = 'TOKEN_EXPIRED',
  InvalidToken = 'INVALID_TOKEN',
  Unauthorized = 'UNAUTHORISED',
}

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

  ValidationError = 'VALIDATION_ERROR',
}

export const enum EApiValidationError {
  Required = 'REQUIRED',
  UserNotFound = 'USER_NOT_FOUND',
  UserExist = 'USER_EXIST',
  PasswordIncorrect = 'PASSWORD_INCORRECT',
  InvalidPassword = 'INVALID_PASSWORD',
}

export interface IApiError {
  error: EApiErrorCode,
  payload?: string | number | object
}

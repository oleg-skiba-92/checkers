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
}

//#endregion enums

export type TSimpleCallback = () => void;
export type TSimpleDataCallback<T> = (data: T) => void;

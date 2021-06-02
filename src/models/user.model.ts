export interface IUserSession {
  userId: string;
  googleId: string;
  facebookId: string;
}

export interface IUser  {
  id: string;
  userName: string;
}

export interface IRegistrationRequest  {
  userName: string;
  password: string;
  email: string;
}

export interface ILoginRequest  {
  password: string;
  email: string;
}

export interface IUserInfo {
  id: string;
  userName: string;
  email: string;
  dateCreated: string;
}

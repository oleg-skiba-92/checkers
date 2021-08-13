export enum ENotifyType {
  Error = 'error',
  Success = 'success',
  Warning = 'warning'
}

export interface INotify {
  id: string;
  message: string;
  title: string;
  type: ENotifyType;
}

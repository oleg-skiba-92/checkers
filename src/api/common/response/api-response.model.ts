import { IResponse } from '../../models/app.model';
import { EApiErrorCode } from '../../../models';

export const enum EApiResponseType {
  JSON,
  XML,
  ERROR,
  REDIRECT,
}

//#endregion enums

//#region types
export type TApiResponseData = string | number | object;
//#endregion types

//#region interfaces
export interface IApiResponseHeader {
  name: string;
  value: string;
}

export interface IApiResponseError {
  code: EApiErrorCode;  // TODO: error
  message: string;
}

export interface IApiResponsesOptions {
  status?: number;
  headers?: IApiResponseHeader[];
  data?: TApiResponseData;
  type?: EApiResponseType;
  error?: IApiResponseError;
}

export interface IApiResponse {
  data: TApiResponseData;

  send(res: IResponse): void;
}

//#endregion interfaces

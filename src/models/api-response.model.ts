import { Response } from 'express';
import { Logger } from '../api/libs';

const log = new Logger('res');

//#region enums
export const enum EApiErrorCode {
  InvalidData = 'INVALID_DATA',
  NotFound = 'NOT_FOUND',
  Unknown = 'UNKNOWN',
}

export const enum EApiResponseType {
  JSON,
  XML,
  ERROR,
  REDIRECT,
}

//#region types
export type TApiResponseData = string | number | object;
//#endregion types

//#endregion enums

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

  send(res: Response): void;
}

//#endregion interfaces

//#region classes
export class ApiResponse implements IApiResponse {
  private status: number;
  private headers: IApiResponseHeader[];
  private type: EApiResponseType;
  private error: IApiResponseError;

  public data: TApiResponseData;

  constructor(options: IApiResponsesOptions) {
    this.status = options.status || 200;
    this.headers = options.headers || [];
    this.type = options.type || (!!options.error ? EApiResponseType.ERROR : EApiResponseType.JSON);
    this.data = options.data || null;
    this.error = options.error || null;
  }

  public send(res: Response): void {
    if (this.headers && this.headers.length) {
      this.headers.forEach((header) => {
        res.header(header.name, header.value);
      });
    }

    res.status(this.status);

    switch (this.type) {
      case EApiResponseType.REDIRECT:
        res.redirect(<string>this.data);
        break;
      case EApiResponseType.JSON:
        res.json(this.data);
        break;
      case EApiResponseType.ERROR:
        res.json({...this.error, error: this.data});
        break;
      default:
        res.send(this.data);
        break;
    }

    log.info(`${res.req.method}: ${res.req.originalUrl.split('?')[0]} ${this.status}`, this.data);
  }
}

//#endregion classes

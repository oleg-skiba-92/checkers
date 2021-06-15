import {
  EApiResponseType,
  IApiResponse,
  IApiResponseError,
  IApiResponseHeader,
  IApiResponsesOptions,
  TApiResponseData
} from './api-response.model';
import { Logger } from '../../libs';
import { IResponse } from '../../models/app.model';

const log = new Logger('res');

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

  public send(res: IResponse): void {
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

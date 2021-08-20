export interface IHttpConfigs {
  url: string,
  params: RequestInit,
}

export type TInterceptorHandler = (Response) => Promise<Response>

export interface IInterceptor {
  updateParams(httpConfig: IHttpConfigs): IHttpConfigs;

  handleResponse(httpConfig: IHttpConfigs): TInterceptorHandler;

  handleError(httpConfig: IHttpConfigs): TInterceptorHandler;
}

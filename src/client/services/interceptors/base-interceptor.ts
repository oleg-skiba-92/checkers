import { IHttpConfigs, IInterceptor, TInterceptorHandler } from '../../models';

export abstract class BaseAuthInterceptor implements IInterceptor {
  updateParams(httpConfig: IHttpConfigs): IHttpConfigs {
    return httpConfig;
  }

  handleResponse(httpConfig: IHttpConfigs): TInterceptorHandler {
    return (response: Response) => Promise.resolve(response);
  }

  handleError(httpConfig: IHttpConfigs): TInterceptorHandler {
    return (response: Response) => Promise.reject(response);
  }
}

import { BaseAuthInterceptor } from './base-interceptor';
import { IHttpConfigs, IInterceptor, TInterceptorHandler } from '../../models';
import { notifyService } from '../core';
import { EApiErrorCode, IApiError } from '../../../models';

const ERROR_MESSAGES = {
  [EApiErrorCode.NotFound]: 'Not Found',
  [EApiErrorCode.NoToken]: 'User is unauthorised',
  [EApiErrorCode.ParseToken]: 'User is unauthorised',
  [EApiErrorCode.InvalidToken]: 'User is unauthorised',
  [EApiErrorCode.Unauthorized]: 'User is unauthorised',
  [EApiErrorCode.InvalidData]: 'Invalid Data',
  [EApiErrorCode.Unknown]: 'Unknown error',
};

const EXCLUDED_URLS = ['/token'];
const EXCLUDED_ERRORS = [EApiErrorCode.ValidationError];

class ErrorInterceptor extends BaseAuthInterceptor implements IInterceptor {
  handleResponse(httpConfig: IHttpConfigs): TInterceptorHandler {
    return async (response: Response) => {
      if (response.ok) {
        return response;
      }

      let errorData: IApiError;

      try {
        errorData = await response.clone().json();
      } catch (e) {
        switch (response.status) {
          case 404:
            errorData = {error: EApiErrorCode.NotFound};
            break;
          case 400:
            errorData = {error: EApiErrorCode.InvalidData};
            break;
          case 500:
            errorData = {error: EApiErrorCode.SERVER_ERROR};
            break;
          default:
            errorData = {error: EApiErrorCode.Unknown};
        }
      }

      this.showError(httpConfig.url, errorData);


      return response;
    };
  }

  handleError(httpConfig: IHttpConfigs): TInterceptorHandler {
    return (response: Response | IApiError) => {
      if (response && (<IApiError>response).error) {
        this.showError(httpConfig.url, <IApiError>response);
      } else {
        this.showError(httpConfig.url, {error: EApiErrorCode.Unknown});
      }

      return Promise.reject(response);
    };
  }

  private showError(url: string, errorData: IApiError) {
    if (EXCLUDED_ERRORS.indexOf(errorData.error) === -1 && !EXCLUDED_URLS.some(excludeUrl => url.includes(excludeUrl))) {
      notifyService.error(ERROR_MESSAGES[errorData.error]);
    }
  }
}

export const errorInterceptor = new ErrorInterceptor();

import { EApiResponseType, IApiResponse, TApiResponseData } from './api-response.model';
import { ApiResponse } from './api-response.logic';
import { EApiErrorCode } from '../../../models';

const ERROR_MESSAGES = {
  INVALID_DATA: 'Bad request',
  NOT_FOUND: 'Не найдено',
  UNKNOWN: 'Что то пошло не так',
  UNAUTHORIZED: 'UNAUTHORIZED',
  INVALID_TOKEN: 'INVALID_TOKEN',
};

export class ResponseService {
  static successJson(data: TApiResponseData = 'success'): IApiResponse {
    return new ApiResponse({data});
  }

  static successXml(data: string): IApiResponse {
    return new ApiResponse({
      type: EApiResponseType.XML,
      headers: [{name: 'Content-Type', value: 'application/xml'}],
      data
    });
  }

  static redirect(data: string): IApiResponse {
    return new ApiResponse({
      type: EApiResponseType.REDIRECT,
      data
    });
  }

  static unknownError(data: TApiResponseData = null): IApiResponse {
    return new ApiResponse({
      status: 520,
      error: EApiErrorCode.Unknown,
      data,
    });

  }

  public static notFound(data: TApiResponseData = null): IApiResponse {
    return new ApiResponse({
      status: 404,
      error: EApiErrorCode.NotFound,
      data
    });

  }

  public static badRequest(data: TApiResponseData = null, error: EApiErrorCode = EApiErrorCode.InvalidData): IApiResponse {
    return new ApiResponse({
      status: 400,
      error,
      data
    });
  }

  public static unauthorized(data: TApiResponseData = null, error: EApiErrorCode = EApiErrorCode.Unauthorized): IApiResponse {
    return new ApiResponse({
      status: 401,
      error,
      data
    });
  }

  static validationError(data: TApiResponseData = null) {
    return new ApiResponse({
      status: 400,
      error: EApiErrorCode.ValidationError,
      data
    });
  }
}

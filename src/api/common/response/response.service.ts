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

  static unknownError(data: TApiResponseData = null, message: string = ERROR_MESSAGES.UNKNOWN): IApiResponse {
    return new ApiResponse({
      status: 520,
      error: {code: EApiErrorCode.Unknown, message},
      data,
    });

  }

  public static notFound(data: TApiResponseData = null, message: string = ERROR_MESSAGES.NOT_FOUND): IApiResponse {
    return new ApiResponse({
      status: 404,
      error: {code: EApiErrorCode.NotFound, message},
      data
    });

  }

  public static badRequest(data: TApiResponseData = null, message: string = ERROR_MESSAGES.INVALID_DATA): IApiResponse {
    return new ApiResponse({
      status: 400,
      error: {code: EApiErrorCode.InvalidData, message},
      data
    });
  }

  public static unauthorized(data: TApiResponseData = null, message: string = ERROR_MESSAGES.UNAUTHORIZED): IApiResponse {
    return new ApiResponse({
      status: 401,
      error: {code: EApiErrorCode.Unauthorized, message},
      data
    });
  }

  public static invalidToken(data: TApiResponseData = null, message: string = ERROR_MESSAGES.INVALID_TOKEN): IApiResponse {
    return new ApiResponse({
      status: 401,
      error: {code: EApiErrorCode.InvalidToken, message},
      data
    });
  }
}

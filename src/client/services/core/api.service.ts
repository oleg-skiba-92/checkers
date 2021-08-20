import { EAPIEndpoints, IApiError } from '../../../models';
import { BASE_SERVER_URL } from '../../environment';
import { IInterceptor } from '../../models';

const JSON_HEADERS = {
  'Accept': 'application/json',
  'Content-Type': 'application/json'
};

export class ApiService {
  private interceptors: IInterceptor[];

  private get baseUrl(): string {
    return BASE_SERVER_URL;
  }

  private buildUrl(urlParts: EAPIEndpoints[]): string {
    return [this.baseUrl, ...urlParts].join('/');
  }

  constructor() {
    this.interceptors = [];
  }

  get<T>(urlParts: EAPIEndpoints[]): Promise<T> {
    return this.request<T, null>(urlParts, 'GET');
  }

  post<T, R>(urlParts: EAPIEndpoints[], data: T): Promise<R> {
    return this.request<T, R>(urlParts, 'POST', data);
  }

  addInterceptors(interceptors: IInterceptor[]) {
    this.interceptors = [...this.interceptors, ...interceptors];
  }

  private request<T, R>(urlParts: EAPIEndpoints[], method: 'GET' | 'POST', data: T = null): Promise<R> {
    let configs = {
      url: this.buildUrl(urlParts),
      params: <RequestInit>{
        method: method,
        headers: {...JSON_HEADERS},
        mode: 'cors',
        body: data === null ? null : JSON.stringify(data),
        credentials: 'include'
      }
    };

    this.interceptors.forEach(interceptor => {
      configs = interceptor.updateParams(configs);
    });

    let promise = fetch(configs.url, configs.params);

    this.interceptors.forEach(interceptor => {
      promise.then(interceptor.handleResponse(configs), interceptor.handleError(configs));
    });

    return promise
      .then(async (response: Response) => {
        if (response.ok) {
          return response.json();
        }

        let errorData: IApiError;

        try {
          errorData = await response.json();
        } catch (e) {}

        return Promise.reject(errorData);
      });
  }
}

export const apiService = new ApiService();

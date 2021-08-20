import './scss/index.scss';
import App from './app.svelte';
import { apiService } from './services/core';
import { authInterceptor, errorInterceptor } from './services/interceptors';

apiService.addInterceptors([authInterceptor, errorInterceptor]);

const app = new App({
  target: document.body
});

export default app;

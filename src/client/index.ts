import './scss/index.scss';
import App from './components/app.svelte';

const app = new App({
  target: document.body,
  props: {
    name: 'world'
  }
});

export default app;

import { get, writable } from 'svelte/store';
import { EPageState } from '../models';
import { Writable } from 'svelte/types/runtime/store';

class RouterService {
  currentState$: Writable<EPageState>;

  get currentState(): EPageState {
    return get(this.currentState$);
  }

  constructor() {
    this.currentState$ = writable(EPageState.Home);
  }

  goTo(state: EPageState) {
    this.currentState$.set(state);
  }


}

export const routerService = new RouterService();

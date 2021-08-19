import { writable, get } from 'svelte/store';
import { SvelteComponent } from 'svelte';
import { Writable } from 'svelte/types/runtime/store';

import { IActiveModal } from '../../models';

class ModalService {
  activeModal$: Writable<IActiveModal>;

  get activeModal(): IActiveModal {
    return get<IActiveModal>(this.activeModal$);
  }

  constructor() {
    this.activeModal$ = writable(null);
  }

  openModal(component: SvelteComponent) {
    this.activeModal$.set({
      component
    });
  }

  closeActiveModal() {
    if (this.activeModal) {
      this.activeModal$.set(null);
    }
  }
}

export const modalService = new ModalService();

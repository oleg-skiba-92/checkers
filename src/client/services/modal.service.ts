import { writable, get } from 'svelte/store';

class ModalService {
  activeModal$;

  // todo interface
  get activeModal(): any {
    return get<any>(this.activeModal$);
  }

  constructor() {
    this.activeModal$ = writable(null);
  }

  openModal(component) {
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

export class IslandController {
  constructor() {
    this.islands = new Map();
    this.hydrationQueue = new Set();
  }

  register(id, component) {
    this.islands.set(id, {
      component,
      hydrated: false
    });
  }

  async hydrate(id) {
    const island = this.islands.get(id);
    if (!island || island.hydrated) return;

    await island.component.hydrate();
    island.hydrated = true;
  }

  observe() {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.dataset.island;
          this.hydrationQueue.add(id);
          this.processQueue();
        }
      });
    });

    return observer;
  }

  async processQueue() {
    for (const id of this.hydrationQueue) {
      await this.hydrate(id);
      this.hydrationQueue.delete(id);
    }
  }
}
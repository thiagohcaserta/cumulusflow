export function createStore() {
  const state = new Map();
  const subscribers = new Set();

  return {
    get(key) {
      return state.get(key);
    },

    set(key, value) {
      state.set(key, value);
      this.notify({ type: 'state:update', key, value });
    },

    subscribe(callback) {
      subscribers.add(callback);
      return () => subscribers.delete(callback);
    },

    notify(event) {
      subscribers.forEach(callback => callback(event));
    }
  };
}
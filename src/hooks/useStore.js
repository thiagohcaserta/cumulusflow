import { useContext, useCallback } from 'react';
import { StoreContext } from '../context/store';

export function useStore(selector) {
  const store = useContext(StoreContext);

  if (!store) {
    throw new Error('useStore must be used within a StoreProvider');
  }

  const state = selector ? selector(store.getState()) : store.getState();
  
  const setState = useCallback((key, value) => {
    store.setState(key, value);
  }, [store]);

  return [state, setState];
}
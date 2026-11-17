/**
 * Tiny persisted-state hook on top of AsyncStorage (works offline).
 * Every component using the same key stays in sync, so a change made on one
 * screen shows up immediately on the screens beneath it in the stack.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';

type Listener = (value: unknown) => void;
const listeners = new Map<string, Set<Listener>>();
const cache = new Map<string, unknown>();

function emit(key: string, value: unknown, except?: Listener) {
  cache.set(key, value);
  listeners.get(key)?.forEach((l) => l !== except && l(value));
}

export function useStoredState<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => (cache.has(key) ? (cache.get(key) as T) : initial));
  const [ready, setReady] = useState(() => cache.has(key));

  useEffect(() => {
    let alive = true;
    const listener: Listener = (v) => setValue(v as T);
    if (!listeners.has(key)) listeners.set(key, new Set());
    listeners.get(key)!.add(listener);

    if (!cache.has(key)) {
      AsyncStorage.getItem(key)
        .then((raw) => {
          if (!alive) return;
          if (raw != null) emit(key, JSON.parse(raw));
          else cache.set(key, initial);
        })
        .catch(() => {})
        .finally(() => alive && setReady(true));
    }
    return () => {
      alive = false;
      listeners.get(key)?.delete(listener);
    };
    // `initial` is only a fallback for first load
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const update = useCallback(
    (next: T | ((prev: T) => T)) => {
      const prev = (cache.has(key) ? cache.get(key) : initial) as T;
      const resolved = typeof next === 'function' ? (next as (p: T) => T)(prev) : next;
      emit(key, resolved);
      AsyncStorage.setItem(key, JSON.stringify(resolved)).catch(() => {});
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [key],
  );

  return [value, update, ready] as const;
}

export const uid = () => `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;

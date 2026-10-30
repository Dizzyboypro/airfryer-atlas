import { useEffect, useState } from "react";

export function useStoredState<T>(
  key: string,
  initialValue: T | (() => T),
): [T, (value: T | ((current: T) => T)) => void] {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw !== null) return JSON.parse(raw) as T;
    } catch {
      // Игнорируем повреждённые данные и используем значение по умолчанию.
    }
    return typeof initialValue === "function"
      ? (initialValue as () => T)()
      : initialValue;
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Хранилище может быть недоступно.
    }
  }, [key, value]);

  return [value, setValue];
}

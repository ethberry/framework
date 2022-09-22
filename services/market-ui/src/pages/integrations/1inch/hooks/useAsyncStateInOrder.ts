import { SetStateAction, useState } from "react";

export const useAsyncStateInOrder = <T>(initialState: T | (() => T)) => {
  const [value, setValue] = useState<T>(initialState);

  const [{ clearSetters }, setClearer] = useState<{
    clearSetters: () => void;
  }>({
    clearSetters: () => {},
  });
  let isCancelled = false;

  const setter = (val: SetStateAction<T>) => {
    if (isCancelled) return;
    setValue(val);
  };
  return [
    value,
    setter,
    () => {
      clearSetters();
      setClearer({
        clearSetters: () => {
          isCancelled = true;
        },
      });
    },
  ] as const;
};

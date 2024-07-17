import React, { createContext, PropsWithChildren, useContext, useState } from "react";

export type ListItemProviderProps<V, R = any> = {
  callback: (value: V) => Promise<R>;
};

type ListItemContextType<V, R = any> = {
  callback: (value: V) => Promise<R>;
  callbackResponse: Record<string, R>;
  setCallbackResponse: (value: ((prevState: Record<string, R>) => Record<string, R>) | Record<string, R>) => void;
};

const ListWrapperContext = createContext<ListItemContextType<any, any> | null>(null);

export const ListItemProvider = <V, R = any>({ children, callback }: PropsWithChildren<ListItemProviderProps<V>>) => {
  const [callbackResponse, setCallbackResponse] = useState<Record<string, R>>({});

  return (
    <ListWrapperContext.Provider value={{ callbackResponse, callback, setCallbackResponse }}>
      {children}
    </ListWrapperContext.Provider>
  );
};

export const useListItemContext = <V, R = any>(): ListItemContextType<V, R> | null => {
  return useContext(ListWrapperContext) as ListItemContextType<V, R> | null;
};

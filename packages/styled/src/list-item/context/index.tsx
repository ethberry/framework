import React, { createContext, PropsWithChildren, useContext, useState } from "react";

export interface IListItemProviderProps<V, R = any> {
  callback: (value: V) => Promise<R>;
}

interface IListItemContextType<V, R = any> {
  callback: (value: V) => Promise<R>;
  callbackResponse: Record<string, R>;
  setCallbackResponse: (value: ((prevState: Record<string, R>) => Record<string, R>) | Record<string, R>) => void;
}

const ListWrapperContext = createContext<IListItemContextType<any, any> | null>(null);

export const ListItemProvider = <V, R = any>({ children, callback }: PropsWithChildren<IListItemProviderProps<V>>) => {
  const [callbackResponse, setCallbackResponse] = useState<Record<string, R>>({});

  return (
    <ListWrapperContext.Provider value={{ callbackResponse, callback, setCallbackResponse }}>
      {children}
    </ListWrapperContext.Provider>
  );
};

export const useListItemContext = <V, R = any>(): IListItemContextType<V, R> | null => {
  return useContext(ListWrapperContext) as IListItemContextType<V, R> | null;
};

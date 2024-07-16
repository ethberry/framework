import React, { createContext, PropsWithChildren, useContext, useState } from "react";

export type ListWrapperProviderProps<V, R = any> = {
  callback: (value: V) => Promise<R>;
};

type ListWrapperContextType<V, R = any> = {
  callback: (value: V) => Promise<R>;
  callbackResponse: Record<string, R>;
  setCallbackResponse: (value: ((prevState: Record<string, R>) => Record<string, R>) | Record<string, R>) => void;
};

const ListWrapperContext = createContext<ListWrapperContextType<any, any> | null>(null);

export const ListWrapperProvider = <V, R = any>({
  children,
  callback,
}: PropsWithChildren<ListWrapperProviderProps<V>>) => {
  const [callbackResponse, setCallbackResponse] = useState<Record<string, R>>({});

  return (
    <ListWrapperContext.Provider value={{ callbackResponse, callback, setCallbackResponse }}>
      {children}
    </ListWrapperContext.Provider>
  );
};

export const useListWrapperContext = <V, R = any>(): ListWrapperContextType<V, R> | null => {
  return useContext(ListWrapperContext) as ListWrapperContextType<V, R> | null;
};

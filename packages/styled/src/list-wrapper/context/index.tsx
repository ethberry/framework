import React, { PropsWithChildren, useContext, createContext, useState } from "react";

export type ListWrapperProviderProps<V, R> = {
  callback: (value: V) => Promise<R>;
};

type ListWrapperContextType = {
  callback: (value: any) => Promise<any>;
  callbackResponse: Record<string, any> | null;
  setCallbackResponse: (
    value: ((prevState: Record<string, any> | null) => Record<string, any> | null) | Record<string, any> | null,
  ) => void;
};

const ListWrapperContext = createContext<ListWrapperContextType | null>(null);

export const ListWrapperProvider = <V, R>({
  children,
  callback,
}: PropsWithChildren<ListWrapperProviderProps<V, R>>) => {
  const [callbackResponse, setCallbackResponse] = useState<Record<string, R> | null>(null);

  return (
    <ListWrapperContext.Provider value={{ callbackResponse, callback, setCallbackResponse }}>
      {children}
    </ListWrapperContext.Provider>
  );
};

export const useListWrapperContext = () => useContext(ListWrapperContext);

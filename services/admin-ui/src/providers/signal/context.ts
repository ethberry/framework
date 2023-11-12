import { createContext } from "react";

export type TPageRefresher = () => Promise<void>;

export interface ISignalContext {
  setPageRefresher: (fn: TPageRefresher | null) => void;
}

export const SignalContext = createContext<ISignalContext>(undefined!);

import { useContext } from "react";

import { SignalContext } from "./context";

export const useSignal = () => {
  return useContext(SignalContext);
};

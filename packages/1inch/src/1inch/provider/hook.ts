import { useContext } from "react";

import { OneInchContext } from "./context";

export const useOneInch = () => {
  return useContext(OneInchContext);
};

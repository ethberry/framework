import { useContext } from "react";

import { SeaportContext } from "./context";

export const useSeaport = () => {
  return useContext(SeaportContext);
};

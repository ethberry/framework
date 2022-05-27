import { useWeb3React } from "@web3-react/core";
import { Seaport } from "@bthn/seaport-js";

export const useSeaport = () => {
  const { library } = useWeb3React();
  const seaport = new Seaport(library, {});
  return seaport;
};

import { useState } from "react";
import { ethers } from "ethers";
import { formatUnits } from "ethers/lib/utils";

import { useOneInch } from "../provider";

export const useGasPrice = (): string => {
  const [lastUpdate, setLastUpdate] = useState(-Infinity);
  const [state, setState] = useState<string>("");

  const { getRpcUrl } = useOneInch();
  const rpcUrl = getRpcUrl();

  if (rpcUrl && Date.now() - lastUpdate > 1000 * 30) {
    setLastUpdate(Date.now());
    new ethers.providers.JsonRpcProvider(rpcUrl)
      .getGasPrice()
      .then(gp => {
        setState(formatUnits(gp, "gwei"));
      })
      .catch(console.error);
  }

  return state;
};

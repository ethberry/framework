import { useState } from "react";
import { ethers } from "ethers";
import { formatUnits } from "ethers/lib/utils";

export const useGasPrice = (): string => {
  const [lastUpdate, setLastUpdate] = useState(-Infinity);
  const [state, setState] = useState<string>("");

  if (Date.now() - lastUpdate > 1000 * 30) {
    setLastUpdate(Date.now());
    ethers
      .getDefaultProvider()
      .getGasPrice()
      .then(gp => {
        setState(formatUnits(gp, "gwei"));
      })
      .catch(console.error);
  }

  return state;
};

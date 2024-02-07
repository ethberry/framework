import { Help } from "@mui/icons-material";

import { getIconByChainId } from "@gemunion/provider-wallet";

export const getChainIconParams = (chainId: number) => {
  const chainIcon = getIconByChainId(chainId);
  return chainIcon
    ? {
        chainIcon,
        viewBox: "0 0 60 60",
      }
    : {
        chainIcon: Help,
        viewBox: "0 0 24 24",
      };
};

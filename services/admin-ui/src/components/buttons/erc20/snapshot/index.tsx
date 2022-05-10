import { FC } from "react";
import { IconButton, Tooltip } from "@mui/material";
import { PaidOutlined } from "@mui/icons-material";
import { useIntl } from "react-intl";
import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";

import { useMetamask } from "@gemunion/react-hooks";
import coin from "@framework/binance-contracts/artifacts/contracts/Coin/Coin.sol/Coin.json";

export const Erc20TokenSnapshotButton: FC = () => {
  const { library } = useWeb3React();

  const { formatMessage } = useIntl();

  const handleSnapshot = useMetamask(() => {
    const contract = new ethers.Contract(process.env.ERC20_COIN, coin.abi, library.getSigner());
    return contract.snapshot() as Promise<void>;
  });

  return (
    <Tooltip title={formatMessage({ id: "pages.erc20-tokens.snapshot" })}>
      <IconButton onClick={handleSnapshot} data-testid="Erc20SnapshotButton">
        <PaidOutlined />
      </IconButton>
    </Tooltip>
  );
};

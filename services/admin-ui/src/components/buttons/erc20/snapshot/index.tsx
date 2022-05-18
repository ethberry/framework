import { FC } from "react";
import { IconButton, Tooltip } from "@mui/material";
import { PaidOutlined } from "@mui/icons-material";
import { useIntl } from "react-intl";
import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";

import { useMetamask } from "@gemunion/react-hooks";
import { IErc20Token } from "@framework/types";
import ERC20Simple from "@framework/binance-contracts/artifacts/contracts/ERC20/ERC20Simple.sol/ERC20Simple.json";

export interface IErc20TokenSnapshotButtonProps {
  token: IErc20Token;
}

export const Erc20TokenSnapshotButton: FC<IErc20TokenSnapshotButtonProps> = props => {
  const { token } = props;

  const { library } = useWeb3React();

  const { formatMessage } = useIntl();

  const handleSnapshot = useMetamask(() => {
    const contract = new ethers.Contract(token.address, ERC20Simple.abi, library.getSigner());
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

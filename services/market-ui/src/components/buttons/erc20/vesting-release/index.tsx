import { FC } from "react";
import { IconButton, Tooltip } from "@mui/material";
import { useWeb3React } from "@web3-react/core";
import { Redeem } from "@mui/icons-material";
import { useIntl } from "react-intl";
import { Contract } from "ethers";

import { useMetamask } from "@gemunion/react-hooks-eth";
import { IErc20Vesting } from "@framework/types";
import CliffVestingSol from "@framework/core-contracts/artifacts/contracts/Vesting/CliffVesting.sol/CliffVesting.json";

export interface IVestingReleaseButtonProps {
  vesting: IErc20Vesting;
}

export const VestingReleaseButton: FC<IVestingReleaseButtonProps> = props => {
  const { vesting } = props;

  const { library } = useWeb3React();
  const { formatMessage } = useIntl();

  const metaRelease = useMetamask((vesting: IErc20Vesting) => {
    const contract = new Contract(vesting.address, CliffVestingSol.abi, library.getSigner());
    return contract.release(vesting.address) as Promise<void>;
  });

  const handleRelease = (vesting: IErc20Vesting) => {
    return () => {
      return metaRelease(vesting);
    };
  };

  return (
    <Tooltip title={formatMessage({ id: "form.tips.release" })} enterDelay={300}>
      <IconButton color="inherit" onClick={handleRelease(vesting)}>
        <Redeem />
      </IconButton>
    </Tooltip>
  );
};

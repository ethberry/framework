import { FC } from "react";
import { IconButton } from "@mui/material";
import { Web3ContextType } from "@web3-react/core";
import { Redeem } from "@mui/icons-material";
import { Contract } from "ethers";

import { useMetamask } from "@gemunion/react-hooks-eth";
import { IVesting } from "@framework/types";

import CliffVestingSol from "@framework/core-contracts/artifacts/contracts/Mechanics/Vesting/CliffVesting.sol/CliffVesting.json";

export interface IVestingReleaseButtonProps {
  vesting: IVesting;
}

export const VestingReleaseButton: FC<IVestingReleaseButtonProps> = props => {
  const { vesting } = props;

  const metaRelease = useMetamask((vesting: IVesting, web3Context: Web3ContextType) => {
    const contract = new Contract(vesting.address, CliffVestingSol.abi, web3Context.provider?.getSigner());
    return contract["release()"]() as Promise<void>;
  });

  const handleRelease = () => {
    return metaRelease(vesting);
  };

  return (
    <IconButton onClick={handleRelease} data-testid="VestingReleaseButton">
      <Redeem />
    </IconButton>
  );
};

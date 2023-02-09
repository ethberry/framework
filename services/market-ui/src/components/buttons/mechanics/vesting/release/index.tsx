import { FC } from "react";
import { IconButton, Tooltip } from "@mui/material";
import { Web3ContextType } from "@web3-react/core";
import { Redeem } from "@mui/icons-material";
import { Contract } from "ethers";
import { useIntl } from "react-intl";

import { useMetamask } from "@gemunion/react-hooks-eth";
import { IContract } from "@framework/types";

import CliffVestingSol from "@framework/core-contracts/artifacts/contracts/Mechanics/Vesting/CliffVesting.sol/CliffVesting.json";

export interface IVestingReleaseButtonProps {
  vesting: IContract;
}

export const VestingReleaseButton: FC<IVestingReleaseButtonProps> = props => {
  const { vesting } = props;

  const { formatMessage } = useIntl();

  const metaRelease = useMetamask(async (vesting: IContract, web3Context: Web3ContextType) => {
    const contract = new Contract(vesting.address, CliffVestingSol.abi, web3Context.provider?.getSigner());
    // https://ethereum.stackexchange.com/questions/132850/incorrect-gaslimit-estimation-for-transaction
    const estGas = await contract["release()"].estimateGas();
    return contract["release()"]({
      gasLimit: estGas.add(estGas.div(100).mul(10)),
    }) as Promise<void>;
  });

  const handleClick = () => {
    return metaRelease(vesting);
  };

  return (
    <Tooltip title={formatMessage({ id: "form.tips.release" })}>
      <IconButton onClick={handleClick} data-testid="VestingReleaseButton">
        <Redeem />
      </IconButton>
    </Tooltip>
  );
};

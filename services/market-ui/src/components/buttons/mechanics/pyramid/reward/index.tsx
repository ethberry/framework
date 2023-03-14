import { FC } from "react";
import { useIntl } from "react-intl";
import { IconButton, Tooltip } from "@mui/material";
import { Redeem } from "@mui/icons-material";
import { Contract } from "ethers";
import { Web3ContextType } from "@web3-react/core";

import { IPyramidDeposit, PyramidDepositStatus } from "@framework/types";
import { useMetamask } from "@gemunion/react-hooks-eth";

import ReceiveRewardABI from "./receiveRewarc.abi.json";

export interface IPyramidRewardButtonProps {
  stake: IPyramidDeposit;
}

export const PyramidRewardButton: FC<IPyramidRewardButtonProps> = props => {
  const { stake } = props;

  const { formatMessage } = useIntl();

  const metaFn = useMetamask((stake: IPyramidDeposit, web3Context: Web3ContextType) => {
    const contract = new Contract(
      stake.pyramidRule!.contract.address,
      ReceiveRewardABI,
      web3Context.provider?.getSigner(),
    );
    return contract.receiveReward(stake.externalId, false, false) as Promise<void>;
  });

  const handleReward = (stake: IPyramidDeposit): (() => Promise<any>) => {
    return (): Promise<any> => {
      return metaFn(stake);
    };
  };

  if (stake.pyramidDepositStatus !== PyramidDepositStatus.ACTIVE) {
    return null;
  }

  return (
    <Tooltip title={formatMessage({ id: "form.tips.reward" })}>
      <IconButton onClick={handleReward(stake)} data-testid="StakeRewardButton">
        <Redeem />
      </IconButton>
    </Tooltip>
  );
};

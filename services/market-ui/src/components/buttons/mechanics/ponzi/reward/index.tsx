import { FC } from "react";
import { useIntl } from "react-intl";
import { IconButton, Tooltip } from "@mui/material";
import { Redeem } from "@mui/icons-material";
import { Contract } from "ethers";
import { Web3ContextType } from "@web3-react/core";

import { IPonziDeposit, PonziDepositStatus } from "@framework/types";
import { useMetamask } from "@gemunion/react-hooks-eth";

import PonziReceiveRewardABI from "../../../../../abis/mechanics/common/reward/receiveReward.abi.json";

export interface IPonziRewardButtonProps {
  stake: IPonziDeposit;
}

export const PonziRewardButton: FC<IPonziRewardButtonProps> = props => {
  const { stake } = props;

  const { formatMessage } = useIntl();

  const metaFn = useMetamask((stake: IPonziDeposit, web3Context: Web3ContextType) => {
    const contract = new Contract(
      stake.ponziRule!.contract.address,
      PonziReceiveRewardABI,
      web3Context.provider?.getSigner(),
    );
    return contract.receiveReward(stake.externalId, false, false) as Promise<void>;
  });

  const handleReward = (stake: IPonziDeposit): (() => Promise<any>) => {
    return (): Promise<any> => {
      return metaFn(stake);
    };
  };

  if (stake.ponziDepositStatus !== PonziDepositStatus.ACTIVE) {
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

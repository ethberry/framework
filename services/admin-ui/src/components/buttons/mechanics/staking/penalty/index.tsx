import { FC } from "react";
import { IconButton, Tooltip } from "@mui/material";
import { Policy } from "@mui/icons-material";
import { Web3ContextType } from "@web3-react/core";
import { Contract } from "ethers";
import { useIntl } from "react-intl";

import { useMetamaskValue } from "@gemunion/react-hooks-eth";
import type { IBalance } from "@framework/types";

import StakingCountersABI from "../../../../../abis/mechanics/staking/stakingCounters.abi.json";
import { formatEther } from "../../../../../utils/money";

export interface IStakingPenaltyBalanceButtonProps {
  balance: IBalance;
}

export const StakingPenaltyBalanceButton: FC<IStakingPenaltyBalanceButtonProps> = props => {
  const { balance } = props;

  const { formatMessage } = useIntl();

  const metaGetPenalty = useMetamaskValue(
    async (balance: IBalance, web3Context: Web3ContextType) => {
      const contract = new Contract(balance.account, StakingCountersABI, web3Context.provider?.getSigner());
      return contract.getPenalty(balance.token!.template!.contract!.address, balance.token!.tokenId) as Promise<any>;
    },
    { success: false },
  );

  const handleClick = async () => {
    const amount = await metaGetPenalty(balance);
    alert(
      formatEther(
        amount.toString(),
        balance.token?.template?.contract?.decimals,
        balance.token?.template?.contract?.symbol,
      ),
    );
  };

  return (
    <Tooltip title={formatMessage({ id: "form.tips.penalty" })}>
      <IconButton onClick={handleClick} data-testid="StakingPenaltyBalanceButton">
        <Policy />
      </IconButton>
    </Tooltip>
  );
};

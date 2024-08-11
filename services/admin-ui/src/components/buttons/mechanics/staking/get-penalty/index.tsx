import { FC } from "react";
import { Policy } from "@mui/icons-material";
import { Web3ContextType } from "@web3-react/core";
import { Contract } from "ethers";

import { formatEther } from "@framework/exchange";
import { ListAction, ListActionVariant } from "@framework/styled";
import type { IBalance } from "@framework/types";
import { useMetamaskValue } from "@gemunion/react-hooks-eth";

import StakingGetPenaltyABI from "@framework/abis/json/Staking/getPenalty.json";

export interface IStakingPenaltyBalanceButtonProps {
  balance: IBalance;
  className?: string;
  disabled?: boolean;
  variant?: ListActionVariant;
}

export const StakingGetPenaltyBalanceButton: FC<IStakingPenaltyBalanceButtonProps> = props => {
  const { balance, className, disabled, variant } = props;

  const metaGetPenalty = useMetamaskValue(
    async (balance: IBalance, web3Context: Web3ContextType) => {
      const contract = new Contract(balance.account, StakingGetPenaltyABI, web3Context.provider?.getSigner());
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
    <ListAction
      onClick={handleClick}
      icon={Policy}
      message="form.tips.penalty"
      className={className}
      dataTestId="StakingPenaltyBalanceButton"
      disabled={disabled}
      variant={variant}
    />
  );
};

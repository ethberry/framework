import { FC } from "react";
import { PauseCircleOutline, PlayCircleOutline } from "@mui/icons-material";
import { Web3ContextType } from "@web3-react/core";
import { Contract } from "ethers";

import { useMetamask } from "@gemunion/react-hooks-eth";
import { ListAction, ListActionVariant } from "@framework/mui-lists";
import { IStakingRule, StakingRuleStatus } from "@framework/types";

import StakingUpdateRuleABI from "../../../../../abis/mechanics/staking/rule-toggle/updateRule.abi.json";

export interface IStakingToggleRuleButtonProps {
  className?: string;
  disabled?: boolean;
  rule: IStakingRule;
  variant?: ListActionVariant;
}

export const StakingToggleRuleButton: FC<IStakingToggleRuleButtonProps> = props => {
  const { className, disabled, rule, variant } = props;

  const metaToggleRule = useMetamask((rule: IStakingRule, web3Context: Web3ContextType) => {
    const ruleStatus: boolean = rule.stakingRuleStatus !== StakingRuleStatus.ACTIVE;
    const contract = new Contract(rule.contract!.address, StakingUpdateRuleABI, web3Context.provider?.getSigner());
    return contract.updateRule(rule.externalId || 0, ruleStatus) as Promise<void>;
  });

  const handleToggleRule = (rule: IStakingRule): (() => Promise<void>) => {
    return (): Promise<void> => {
      return metaToggleRule(rule);
    };
  };

  return (
    <ListAction
      onClick={handleToggleRule(rule)}
      icon={rule.stakingRuleStatus === StakingRuleStatus.ACTIVE ? <PauseCircleOutline /> : <PlayCircleOutline />}
      message={
        rule.stakingRuleStatus === StakingRuleStatus.ACTIVE
          ? "pages.staking.rules.deactivate"
          : "pages.staking.rules.activate"
      }
      className={className}
      dataTestId="StakeToggleRuleButton"
      disabled={disabled}
      variant={variant}
    />
  );
};

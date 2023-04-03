import { FC } from "react";
import { useIntl } from "react-intl";
import { IconButton, Tooltip } from "@mui/material";
import { PauseCircleOutline, PlayCircleOutline } from "@mui/icons-material";
import { Contract } from "ethers";
import { Web3ContextType } from "@web3-react/core";

import { useMetamask } from "@gemunion/react-hooks-eth";
import { IStakingRule, StakingRuleStatus } from "@framework/types";

import StakingUpdateRuleABI from "../../../../../abis/components/buttons/mechanics/staking/rule-toggle/updateRule.abi.json";

export interface IStakingToggleRuleButtonProps {
  rule: IStakingRule;
}

export const StakingToggleRuleButton: FC<IStakingToggleRuleButtonProps> = props => {
  const { rule } = props;
  const { formatMessage } = useIntl();

  const metaToggleRule = useMetamask((rule: IStakingRule, web3Context: Web3ContextType) => {
    const ruleStatus: boolean = rule.stakingRuleStatus !== StakingRuleStatus.ACTIVE;
    const contract = new Contract(process.env.STAKING_ADDR, StakingUpdateRuleABI, web3Context.provider?.getSigner());
    return contract.updateRule(rule.externalId || 0, ruleStatus) as Promise<void>;
  });

  const handleToggleRule = (rule: IStakingRule): (() => Promise<void>) => {
    return (): Promise<void> => {
      return metaToggleRule(rule);
    };
  };

  return (
    <Tooltip
      title={formatMessage({
        id:
          rule.stakingRuleStatus === StakingRuleStatus.ACTIVE
            ? "pages.staking.rules.deactivate"
            : "pages.staking.rules.activate",
      })}
    >
      <IconButton onClick={handleToggleRule(rule)} data-testid="StakeToggleRuleButton">
        {rule.stakingRuleStatus === StakingRuleStatus.ACTIVE ? <PauseCircleOutline /> : <PlayCircleOutline />}
      </IconButton>
    </Tooltip>
  );
};

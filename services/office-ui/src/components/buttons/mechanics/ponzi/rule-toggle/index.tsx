import { FC } from "react";
import { PauseCircleOutline, PlayCircleOutline } from "@mui/icons-material";
import { Web3ContextType } from "@web3-react/core";
import { Contract } from "ethers";

import { useMetamask } from "@gemunion/react-hooks-eth";
import { ListAction, ListActionVariant } from "@framework/styled";
import { IPonziRule, PonziRuleStatus } from "@framework/types";

import PonziUpdateRuleABI from "../../../../../abis/mechanics/ponzi/rule-toggle/updateRule.abi.json";

export interface IPonziToggleRuleButtonProps {
  className?: string;
  disabled?: boolean;
  rule: IPonziRule;
  variant?: ListActionVariant;
}

export const PonziToggleRuleButton: FC<IPonziToggleRuleButtonProps> = props => {
  const { className, disabled, rule, variant } = props;

  const metaToggleRule = useMetamask((rule: IPonziRule, web3Context: Web3ContextType) => {
    const ruleStatus: boolean = rule.ponziRuleStatus !== PonziRuleStatus.ACTIVE;
    const contract = new Contract(rule.contract.address, PonziUpdateRuleABI, web3Context.provider?.getSigner());
    return contract.updateRule(rule.externalId || 0, ruleStatus) as Promise<void>;
  });

  const handleToggleRule = (rule: IPonziRule): (() => Promise<void>) => {
    return (): Promise<void> => {
      return metaToggleRule(rule);
    };
  };

  return (
    <ListAction
      onClick={handleToggleRule(rule)}
      icon={rule.ponziRuleStatus === PonziRuleStatus.ACTIVE ? PauseCircleOutline : PlayCircleOutline}
      message={
        rule.ponziRuleStatus === PonziRuleStatus.ACTIVE ? "pages.ponzi.rules.deactivate" : "pages.ponzi.rules.activate"
      }
      className={className}
      dataTestId="PonziToggleRuleButton"
      disabled={disabled}
      variant={variant}
    />
  );
};

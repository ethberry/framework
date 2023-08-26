import { FC } from "react";
import { useIntl } from "react-intl";
import { IconButton, Tooltip } from "@mui/material";
import { PauseCircleOutline, PlayCircleOutline } from "@mui/icons-material";
import { Contract } from "ethers";
import { Web3ContextType } from "@web3-react/core";

import { useMetamask } from "@gemunion/react-hooks-eth";
import { IPonziRule, PonziRuleStatus } from "@framework/types";

import PonziUpdateRuleABI from "../../../../../abis/mechanics/ponzi/rule-toggle/updateRule.abi.json";

export interface IPonziToggleRuleButtonProps {
  rule: IPonziRule;
}

export const PonziToggleRuleButton: FC<IPonziToggleRuleButtonProps> = props => {
  const { rule } = props;
  const { formatMessage } = useIntl();

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
    <Tooltip
      title={formatMessage({
        id:
          rule.ponziRuleStatus === PonziRuleStatus.ACTIVE
            ? "pages.ponzi.rules.deactivate"
            : "pages.ponzi.rules.activate",
      })}
    >
      <IconButton onClick={handleToggleRule(rule)} data-testid="StakeToggleRuleButton">
        {rule.ponziRuleStatus === PonziRuleStatus.ACTIVE ? <PauseCircleOutline /> : <PlayCircleOutline />}
      </IconButton>
    </Tooltip>
  );
};

import { FC } from "react";
import { useIntl } from "react-intl";
import { IconButton, Tooltip } from "@mui/material";
import { PauseCircleOutline, PlayCircleOutline } from "@mui/icons-material";
import { Contract } from "ethers";
import { Web3ContextType } from "@web3-react/core";

import { useMetamask } from "@gemunion/react-hooks-eth";
import { IPyramidRule, PyramidRuleStatus } from "@framework/types";

import PyramidUpdateRuleABI from "../../../../../abis/mechanics/pyramid/rule-toggle/updateRule.abi.json";

export interface IPyramidToggleRuleButtonProps {
  rule: IPyramidRule;
}

export const PyramidToggleRuleButton: FC<IPyramidToggleRuleButtonProps> = props => {
  const { rule } = props;
  const { formatMessage } = useIntl();

  const metaToggleRule = useMetamask((rule: IPyramidRule, web3Context: Web3ContextType) => {
    const ruleStatus: boolean = rule.pyramidRuleStatus !== PyramidRuleStatus.ACTIVE;
    const contract = new Contract(rule.contract.address, PyramidUpdateRuleABI, web3Context.provider?.getSigner());
    return contract.updateRule(rule.externalId || 0, ruleStatus) as Promise<void>;
  });

  const handleToggleRule = (rule: IPyramidRule): (() => Promise<void>) => {
    return (): Promise<void> => {
      return metaToggleRule(rule);
    };
  };

  return (
    <Tooltip
      title={formatMessage({
        id:
          rule.pyramidRuleStatus === PyramidRuleStatus.ACTIVE
            ? "pages.pyramid.rules.deactivate"
            : "pages.pyramid.rules.activate",
      })}
    >
      <IconButton onClick={handleToggleRule(rule)} data-testid="StakeToggleRuleButton">
        {rule.pyramidRuleStatus === PyramidRuleStatus.ACTIVE ? <PauseCircleOutline /> : <PlayCircleOutline />}
      </IconButton>
    </Tooltip>
  );
};

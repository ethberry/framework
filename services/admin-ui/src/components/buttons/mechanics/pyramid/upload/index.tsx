import { FC } from "react";
import { useIntl } from "react-intl";
import { IconButton, Tooltip } from "@mui/material";
import { Check, Close, CloudUpload } from "@mui/icons-material";
import { Contract } from "ethers";
import { Web3ContextType } from "@web3-react/core";

import { useMetamask } from "@gemunion/react-hooks-eth";
import { IPyramidRule, PyramidRuleStatus, TokenType } from "@framework/types";

import PyramidSetRulesABI from "../../../../../abis/components/buttons/mechanics/pyramid/upload/setRules.abi.json";
import PyramidUpdateRuleABI from "../../../../../abis/components/buttons/mechanics/pyramid/upload/updateRule.abi.json";

export interface IPyramidUploadButtonProps {
  rule: IPyramidRule;
}

export const PyramidUploadButton: FC<IPyramidUploadButtonProps> = props => {
  const { rule } = props;
  const { formatMessage } = useIntl();

  const metaLoadRule = useMetamask((rule: IPyramidRule, web3Context: Web3ContextType) => {
    if (rule.pyramidRuleStatus !== PyramidRuleStatus.NEW) {
      return Promise.reject(new Error(""));
    }

    const stakingRule = {
      externalId: rule.id,
      deposit: rule.deposit?.components.map(component => ({
        tokenType: Object.keys(TokenType).indexOf(component.tokenType),
        token: component.contract!.address,
        tokenId: component.templateId || 0,
        amount: component.amount,
      }))[0],
      reward: rule.reward?.components.map(component => ({
        tokenType: Object.keys(TokenType).indexOf(component.tokenType),
        token: component.contract!.address,
        tokenId: component.templateId,
        amount: component.amount,
      }))[0],
      period: rule.durationAmount, // todo fix same name // seconds in days
      penalty: rule.penalty || 0,
      active: true, // TODO new rules always ACTIVE ?
    };

    const contract = new Contract(rule.contract.address, PyramidSetRulesABI, web3Context.provider?.getSigner());
    return contract.setRules([stakingRule]) as Promise<void>;
  });

  const handleLoadRule = (rule: IPyramidRule): (() => Promise<void>) => {
    return async (): Promise<void> => {
      return metaLoadRule(rule);
    };
  };

  const metaToggleRule = useMetamask((rule: IPyramidRule, web3Context: Web3ContextType) => {
    let ruleStatus: boolean;
    if (rule.pyramidRuleStatus === PyramidRuleStatus.NEW) {
      // this should never happen
      return Promise.reject(new Error(":)"));
    } else {
      ruleStatus = rule.pyramidRuleStatus !== PyramidRuleStatus.ACTIVE;
    }

    const contract = new Contract(rule.contract.address, PyramidUpdateRuleABI, web3Context.provider?.getSigner());
    return contract.updateRule(rule.externalId, ruleStatus) as Promise<void>;
  });

  const handleToggleRule = (rule: IPyramidRule): (() => Promise<void>) => {
    return (): Promise<void> => {
      return metaToggleRule(rule);
    };
  };

  if (rule.pyramidRuleStatus === PyramidRuleStatus.NEW) {
    return (
      <Tooltip title={formatMessage({ id: "pages.staking.rules.upload" })}>
        <IconButton onClick={handleLoadRule(rule)} data-testid="StakeRuleUploadButton">
          <CloudUpload />
        </IconButton>
      </Tooltip>
    );
  }

  return (
    <Tooltip
      title={formatMessage({
        id:
          rule.pyramidRuleStatus === PyramidRuleStatus.ACTIVE
            ? "pages.staking.rules.deactivate"
            : "pages.staking.rules.activate",
      })}
    >
      <IconButton onClick={handleToggleRule(rule)} data-testid="StakeRuleToggleButton">
        {rule.pyramidRuleStatus === PyramidRuleStatus.ACTIVE ? <Close /> : <Check />}
      </IconButton>
    </Tooltip>
  );
};

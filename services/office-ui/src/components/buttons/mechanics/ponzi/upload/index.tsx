import { FC } from "react";
import { useIntl } from "react-intl";
import { IconButton, Tooltip } from "@mui/material";
import { Check, Close, CloudUpload } from "@mui/icons-material";
import { Web3ContextType } from "@web3-react/core";
import { Contract } from "ethers";

import { useMetamask } from "@gemunion/react-hooks-eth";
import { ListAction, ListActionVariant } from "@framework/mui-lists";
import { IPonziRule, PonziRuleStatus, TokenType } from "@framework/types";

import PonziSetRuleABI from "../../../../../abis/mechanics/ponzi/upload/setRules.abi.json";
import PonziUpdateRuleABI from "../../../../../abis/mechanics/ponzi/upload/updateRule.abi.json";

export interface IPonziUploadButtonProps {
  disabled?: boolean;
  rule: IPonziRule;
  variant?: ListActionVariant;
}

export const PonziUploadButton: FC<IPonziUploadButtonProps> = props => {
  const { disabled, rule, variant } = props;
  const { formatMessage } = useIntl();

  const metaLoadRule = useMetamask((rule: IPonziRule, web3Context: Web3ContextType) => {
    if (rule.ponziRuleStatus !== PonziRuleStatus.NEW) {
      return Promise.reject(new Error(""));
    }

    const stakingRule = {
      externalId: rule.id,
      deposit: rule.deposit?.components.map(component => ({
        tokenType: Object.values(TokenType).indexOf(component.tokenType),
        token: component.contract!.address,
        tokenId: component.templateId || 0,
        amount: component.amount,
      }))[0],
      reward: rule.reward?.components.map(component => ({
        tokenType: Object.values(TokenType).indexOf(component.tokenType),
        token: component.contract!.address,
        tokenId: component.templateId,
        amount: component.amount,
      }))[0],
      period: rule.durationAmount, // todo fix same name // seconds in days
      penalty: rule.penalty || 0,
      active: true, // TODO new rules always ACTIVE ?
    };

    const contract = new Contract(rule.contract.address, PonziSetRuleABI, web3Context.provider?.getSigner());
    return contract.setRules([stakingRule]) as Promise<void>;
  });

  const handleLoadRule = (rule: IPonziRule): (() => Promise<void>) => {
    return async (): Promise<void> => {
      return metaLoadRule(rule);
    };
  };

  const metaToggleRule = useMetamask((rule: IPonziRule, web3Context: Web3ContextType) => {
    let ruleStatus: boolean;
    if (rule.ponziRuleStatus === PonziRuleStatus.NEW) {
      // this should never happen
      return Promise.reject(new Error(":)"));
    } else {
      ruleStatus = rule.ponziRuleStatus !== PonziRuleStatus.ACTIVE;
    }

    const contract = new Contract(rule.contract.address, PonziUpdateRuleABI, web3Context.provider?.getSigner());
    return contract.updateRule(rule.externalId, ruleStatus) as Promise<void>;
  });

  const handleToggleRule = (rule: IPonziRule): (() => Promise<void>) => {
    return (): Promise<void> => {
      return metaToggleRule(rule);
    };
  };

  if (rule.ponziRuleStatus === PonziRuleStatus.NEW) {
    return (
      <Tooltip title={formatMessage({ id: "pages.staking.rules.upload" })}>
        <IconButton onClick={handleLoadRule(rule)} data-testid="StakeRuleUploadButton">
          <CloudUpload />
        </IconButton>
      </Tooltip>
    );
  }

  return (
    <ListAction
      onClick={handleToggleRule(rule)}
      icon={rule.ponziRuleStatus === PonziRuleStatus.ACTIVE ? Close : Check}
      message={
        rule.ponziRuleStatus === PonziRuleStatus.ACTIVE
          ? "pages.staking.rules.deactivate"
          : "pages.staking.rules.activate"
      }
      dataTestId="StakeRuleToggleButton"
      disabled={disabled}
      variant={variant}
    />
  );
};

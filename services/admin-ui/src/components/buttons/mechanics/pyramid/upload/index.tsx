import { FC } from "react";
import { useIntl } from "react-intl";
import { IconButton, Tooltip } from "@mui/material";
import { Check, Close, CloudUpload } from "@mui/icons-material";
import { Contract } from "ethers";
import { Web3ContextType } from "@web3-react/core";

import { IPyramidRule, PyramidStakingStatus, TokenType } from "@framework/types";
import { useMetamask } from "@gemunion/react-hooks-eth";

import PyramidSol from "@framework/core-contracts/artifacts/contracts/Mechanics/Pyramid/Pyramid.sol/Pyramid.json";

export interface IPyramidUploadButtonProps {
  rule: IPyramidRule;
}

export const PyramidUploadButton: FC<IPyramidUploadButtonProps> = props => {
  const { rule } = props;
  const { formatMessage } = useIntl();

  const metaLoadRule = useMetamask((rule: IPyramidRule, web3Context: Web3ContextType) => {
    if (rule.stakingStatus !== PyramidStakingStatus.NEW) {
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
      period: rule.duration * 86400 || 0, // todo fix same name // seconds in days
      penalty: rule.penalty || 0,
      recurrent: rule.recurrent,
      active: true, // todo add var in interface
    };

    const contract = new Contract(rule.contract.address, PyramidSol.abi, web3Context.provider?.getSigner());
    return contract.setRules([stakingRule]) as Promise<void>;
  });

  const handleLoadRule = (rule: IPyramidRule): (() => Promise<void>) => {
    return async (): Promise<void> => {
      return metaLoadRule(rule);
    };
  };

  const metaToggleRule = useMetamask((rule: IPyramidRule, web3Context: Web3ContextType) => {
    let ruleStatus: boolean;
    if (rule.stakingStatus === PyramidStakingStatus.NEW) {
      // this should never happen
      return Promise.reject(new Error(":)"));
    } else {
      ruleStatus = rule.stakingStatus !== PyramidStakingStatus.ACTIVE;
    }

    const contract = new Contract(rule.contract.address, PyramidSol.abi, web3Context.provider?.getSigner());
    return contract.updateRule(rule.externalId, ruleStatus) as Promise<void>;
  });

  const handleToggleRule = (rule: IPyramidRule): (() => Promise<void>) => {
    return (): Promise<void> => {
      return metaToggleRule(rule);
    };
  };

  if (rule.stakingStatus === PyramidStakingStatus.NEW) {
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
          rule.stakingStatus === PyramidStakingStatus.ACTIVE
            ? "pages.staking.rules.deactivate"
            : "pages.staking.rules.activate",
      })}
    >
      <IconButton onClick={handleToggleRule(rule)} data-testid="StakeRuleToggleButton">
        {rule.stakingStatus === PyramidStakingStatus.ACTIVE ? <Close /> : <Check />}
      </IconButton>
    </Tooltip>
  );
};

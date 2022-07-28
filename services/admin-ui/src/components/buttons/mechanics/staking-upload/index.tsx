import { FC } from "react";
import { useIntl } from "react-intl";
import { IconButton, Tooltip } from "@mui/material";
import { Check, Close, CloudUpload } from "@mui/icons-material";
import { Contract } from "ethers";
import { Web3ContextType } from "@web3-react/core";

import { IStakingRule, StakingStatus, TokenType } from "@framework/types";
import { useMetamask } from "@gemunion/react-hooks-eth";

import StakingSol from "@framework/core-contracts/artifacts/contracts/Mechanics/Staking/Staking.sol/Staking.json";

export interface IStakingUploadButtonProps {
  rule: IStakingRule;
}

export const StakingUploadButton: FC<IStakingUploadButtonProps> = props => {
  const { rule } = props;
  const { formatMessage } = useIntl();

  const metaLoadRule = useMetamask((rule: IStakingRule, web3Context: Web3ContextType) => {
    if (rule.stakingStatus !== StakingStatus.NEW) {
      return Promise.reject(new Error(""));
    }

    const stakingRule = {
      externalId: rule.id,
      deposit: rule.deposit?.components.map(component => ({
        tokenType: Object.keys(TokenType).indexOf(component.tokenType),
        token: component.contract!.address,
        tokenId: component.template!.tokens![0].tokenId,
        amount: component.amount,
      }))[0],
      reward: rule.reward?.components.map(component => ({
        tokenType: Object.keys(TokenType).indexOf(component.tokenType),
        token: component.contract!.address,
        tokenId: component.template!.tokens![0].tokenId,
        amount: component.amount,
      }))[0],
      period: rule.duration || 0, // todo fix same name
      penalty: rule.penalty || 0,
      recurrent: rule.recurrent,
      active: true, // todo add var in interface
    };

    const contract = new Contract(process.env.STAKING_ADDR, StakingSol.abi, web3Context.provider?.getSigner());
    return contract.setRules([stakingRule]) as Promise<void>;
  });

  const handleLoadRule = (rule: IStakingRule): (() => Promise<void>) => {
    return (): Promise<void> => {
      return metaLoadRule(rule).then(() => {
        // TODO reload
      });
    };
  };

  const metaToggleRule = useMetamask((rule: IStakingRule, web3Context: Web3ContextType) => {
    let ruleStatus: boolean;
    if (rule.stakingStatus === StakingStatus.NEW) {
      // it should never happen
      return Promise.reject(new Error(""));
    } else {
      ruleStatus = rule.stakingStatus !== StakingStatus.ACTIVE;
    }

    const contract = new Contract(process.env.STAKING_ADDR, StakingSol.abi, web3Context.provider?.getSigner());
    return contract.updateRule(rule.externalId, ruleStatus) as Promise<void>;
  });

  const handleToggleRule = (rule: IStakingRule): (() => Promise<void>) => {
    return (): Promise<void> => {
      return metaToggleRule(rule).then(() => {
        // TODO reload
      });
    };
  };

  if (rule.stakingStatus === StakingStatus.NEW) {
    return (
      <Tooltip title={formatMessage({ id: "pages.staking-rules.upload" })}>
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
          rule.stakingStatus === StakingStatus.ACTIVE
            ? "pages.staking.rules.deactivate"
            : "pages.staking.rules.activate",
      })}
    >
      <IconButton onClick={handleToggleRule(rule)} data-testid="StakeRuleToggleButton">
        {rule.stakingStatus === StakingStatus.ACTIVE ? <Close /> : <Check />}
      </IconButton>
    </Tooltip>
  );
};

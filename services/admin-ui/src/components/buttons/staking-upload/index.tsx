import { FC } from "react";
import { useIntl } from "react-intl";
import { IconButton, Tooltip } from "@mui/material";
import { Check, Close, CloudUpload } from "@mui/icons-material";
import { BigNumber, constants, Contract } from "ethers";
import { useWeb3React } from "@web3-react/core";

import { IStakingRule, StakingRuleStatus, TokenType } from "@framework/types";
import { useMetamask } from "@gemunion/react-hooks-eth";

import StakingSol from "@framework/core-contracts/artifacts/contracts/Staking/UniStaking.sol/UniStaking.json";

export interface IStakingRuleUploadButtonProps {
  rule: IStakingRule;
}

export const StakingUploadButton: FC<IStakingRuleUploadButtonProps> = props => {
  const { rule } = props;

  const { formatMessage } = useIntl();

  const { library } = useWeb3React();

  const metaLoadRule = useMetamask((rule: IStakingRule) => {
    if (rule.stakingStatus !== StakingRuleStatus.NEW) {
      return Promise.reject(new Error(""));
    }

    const depositCollection =
      rule.deposit.tokenType === TokenType.ERC20
        ? rule.deposit.erc20!.address
        : rule.deposit.tokenType === TokenType.ERC721 || rule.deposit.tokenType === TokenType.ERC721D
        ? rule.deposit.erc721!.address
        : rule.deposit.tokenType === TokenType.ERC998 || rule.deposit.tokenType === TokenType.ERC998D
        ? rule.deposit.erc998!.address
        : rule.deposit.tokenType === TokenType.ERC1155
        ? rule.deposit.erc1155!.address
        : constants.AddressZero; // NATIVE
    const rewardCollection =
      rule.reward.tokenType === TokenType.ERC20
        ? rule.reward.erc20!.address
        : rule.reward.tokenType === TokenType.ERC721 || rule.reward.tokenType === TokenType.ERC721D
        ? rule.reward.erc721!.address
        : rule.reward.tokenType === TokenType.ERC998 || rule.reward.tokenType === TokenType.ERC998D
        ? rule.reward.erc998!.address
        : rule.reward.tokenType === TokenType.ERC1155
        ? rule.reward.erc1155!.address
        : constants.AddressZero; // NATIVE

    const depositType =
      rule.deposit.tokenType === TokenType.ERC20
        ? 1
        : rule.deposit.tokenType === TokenType.ERC721 || rule.deposit.tokenType === TokenType.ERC721D
        ? 2
        : rule.deposit.tokenType === TokenType.ERC998 || rule.deposit.tokenType === TokenType.ERC998D
        ? 3
        : rule.deposit.tokenType === TokenType.ERC1155
        ? 4
        : 0; // NATIVE

    const rewardType =
      rule.reward.tokenType === TokenType.ERC20
        ? 1
        : rule.reward.tokenType === TokenType.ERC721 || rule.reward.tokenType === TokenType.ERC721D
        ? 2
        : rule.reward.tokenType === TokenType.ERC998 || rule.reward.tokenType === TokenType.ERC998D
        ? 3
        : rule.reward.tokenType === TokenType.ERC1155
        ? 4
        : 0; // NATIVE

    const stakingRule = {
      externalId: BigNumber.from(rule.id),
      deposit: {
        amount: BigNumber.from(rule.deposit.amount || 0),
        itemType: depositType,
        tokenId: ~~rule.deposit.tokenId,
        token: depositCollection,
      },
      reward: {
        amount: BigNumber.from(rule.reward.amount || 0),
        itemType: rewardType,
        tokenId: ~~rule.reward.tokenId,
        token: rewardCollection,
      },
      period: BigNumber.from(rule.duration || 0), // todo fix same name
      penalty: BigNumber.from(rule.penalty || 0),
      recurrent: rule.recurrent,
      active: true, // todo add var in interface
    };

    const contract = new Contract(process.env.STAKING_ADDR, StakingSol.abi, library.getSigner());
    return contract.setRules([stakingRule]) as Promise<void>;
  });

  const handleLoadRule = (rule: IStakingRule): (() => Promise<void>) => {
    return (): Promise<void> => {
      return metaLoadRule(rule).then(() => {
        // TODO reload
      });
    };
  };

  const metaToggleRule = useMetamask((rule: IStakingRule) => {
    let ruleStatus: boolean;
    if (rule.stakingStatus === StakingRuleStatus.NEW) {
      // it should never happen
      return Promise.reject(new Error(""));
    } else {
      ruleStatus = rule.stakingStatus !== StakingRuleStatus.ACTIVE;
    }

    const contract = new Contract(process.env.STAKING_ADDR, StakingSol.abi, library.getSigner());
    return contract.updateRule(rule.ruleId, ruleStatus) as Promise<void>;
  });

  const handleToggleRule = (rule: IStakingRule): (() => Promise<void>) => {
    return (): Promise<void> => {
      return metaToggleRule(rule).then(() => {
        // TODO reload
      });
    };
  };

  if (rule.stakingStatus === StakingRuleStatus.NEW) {
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
          rule.stakingStatus === StakingRuleStatus.ACTIVE
            ? "pages.staking-rules.deactivate"
            : "pages.staking-rules.activate",
      })}
    >
      <IconButton onClick={handleToggleRule(rule)} data-testid="StakeRuleToggleButton">
        {rule.stakingStatus === StakingRuleStatus.ACTIVE ? <Close /> : <Check />}
      </IconButton>
    </Tooltip>
  );
};

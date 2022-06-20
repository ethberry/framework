import { FC } from "react";
import { useIntl } from "react-intl";
import { IconButton, Tooltip } from "@mui/material";
import { Check, Close, CloudUpload } from "@mui/icons-material";
import { Contract } from "ethers";
import { useWeb3React } from "@web3-react/core";

import { IStaking, StakingStatus } from "@framework/types";
import { useMetamask } from "@gemunion/react-hooks-eth";

import StakingSol from "@framework/core-contracts/artifacts/contracts/Staking/UniStaking.sol/UniStaking.json";

export interface IStakingUploadButtonProps {
  rule: IStaking;
}

export const StakingUploadButton: FC<IStakingUploadButtonProps> = props => {
  const { rule } = props;

  const { formatMessage } = useIntl();

  const { library } = useWeb3React();

  const metaLoadRule = useMetamask((rule: IStaking) => {
    if (rule.stakingStatus !== StakingStatus.NEW) {
      return Promise.reject(new Error(""));
    }
    console.log("rule", rule);
    const contract = new Contract(process.env.STAKING_ADDR, StakingSol.abi, library.getSigner());
    return contract.setRules([rule]) as Promise<void>;
  });

  const handleLoadRule = (rule: IStaking): (() => Promise<void>) => {
    return (): Promise<void> => {
      return metaLoadRule(rule).then(() => {
        // TODO reload
      });
    };
  };

  const metaToggleRule = useMetamask((rule: IStaking) => {
    let ruleStatus: boolean;
    if (rule.stakingStatus === StakingStatus.NEW) {
      // this should never happen
      return Promise.reject(new Error(""));
    } else {
      ruleStatus = rule.stakingStatus !== StakingStatus.ACTIVE;
    }

    const contract = new Contract(process.env.STAKING_ADDR, StakingSol.abi, library.getSigner());
    return contract.updateRule(rule.id, ruleStatus) as Promise<void>;
  });

  const handleToggleRule = (rule: IStaking): (() => Promise<void>) => {
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
            ? "pages.staking-rules.deactivate"
            : "pages.staking-rules.activate",
      })}
    >
      <IconButton onClick={handleToggleRule(rule)} data-testid="StakeRuleToggleButton">
        {rule.stakingStatus === StakingStatus.ACTIVE ? <Close /> : <Check />}
      </IconButton>
    </Tooltip>
  );
};

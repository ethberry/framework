import { FC } from "react";
import { useIntl } from "react-intl";
import { IconButton, Tooltip } from "@mui/material";
import { Check, Close, CloudUpload } from "@mui/icons-material";
import { Contract } from "ethers";
import { useWeb3React } from "@web3-react/core";

import { IStaking, StakingStatus } from "@framework/types";
import { useMetamask } from "@gemunion/react-hooks-eth";

import StakingSol from "@framework/core-contracts/artifacts/contracts/Staking/interfaces/IStaking.sol/IStaking.json";

export interface IStakingUploadButtonProps {
  rule: IStaking;
}

export const StakingUploadButton: FC<IStakingUploadButtonProps> = props => {
  const { rule } = props;

  const { formatMessage } = useIntl();

  const { library } = useWeb3React();

  const metaLoadRecipe = useMetamask((rule: IStaking) => {
    if (rule.stakingStatus !== StakingStatus.NEW) {
      return Promise.reject(new Error(""));
    }

    const contract = new Contract(process.env.STAKING_ADDR, StakingSol.abi, library.getSigner());
    return contract.createRule() as Promise<void>;
  });

  const handleLoadRule = (recipe: IStaking): (() => Promise<void>) => {
    return (): Promise<void> => {
      return metaLoadRecipe(recipe).then(() => {
        // TODO reload
      });
    };
  };

  const metaToggleRule = useMetamask((rule: IStaking) => {
    let recipeStatus: boolean;
    if (rule.stakingStatus === StakingStatus.NEW) {
      // this should never happen
      return Promise.reject(new Error(""));
    } else {
      recipeStatus = rule.stakingStatus !== StakingStatus.ACTIVE;
    }

    const contract = new Contract(process.env.STAKING_ADDR, StakingSol.abi, library.getSigner());
    return contract.updateRule(rule.id, recipeStatus) as Promise<void>;
  });

  const handleToggleRecipe = (recipe: IStaking): (() => Promise<void>) => {
    return (): Promise<void> => {
      return metaToggleRule(recipe).then(() => {
        // TODO reload
      });
    };
  };

  if (rule.stakingStatus === StakingStatus.NEW) {
    return (
      <Tooltip title={formatMessage({ id: "pages.erc721-recipes.upload" })}>
        <IconButton onClick={handleLoadRule(rule)} data-testid="Erc721RecipeUploadButton">
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
            ? "pages.erc721-recipes.deactivate"
            : "pages.erc721-recipes.activate",
      })}
    >
      <IconButton onClick={handleToggleRecipe(rule)} data-testid="Erc721RecipeToggleButton">
        {rule.stakingStatus === StakingStatus.ACTIVE ? <Close /> : <Check />}
      </IconButton>
    </Tooltip>
  );
};

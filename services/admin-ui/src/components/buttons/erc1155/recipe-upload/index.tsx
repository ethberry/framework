import { FC } from "react";
import { useIntl } from "react-intl";
import { IconButton, Tooltip } from "@mui/material";
import { Close, Save } from "@mui/icons-material";
import { Contract } from "ethers";
import { useWeb3React } from "@web3-react/core";

import { Erc1155RecipeStatus, IErc1155Recipe } from "@framework/types";
import { useMetamask } from "@gemunion/react-hooks";

import ERC1155ERC1155Craft from "@framework/binance-contracts/artifacts/contracts/Craft/ERC1155ERC1155Craft.sol/ERC1155ERC1155Craft.json";

export interface IErc1155RecipeButtonProps {
  recipe: IErc1155Recipe;
}

export const Erc1155RecipeUploadButton: FC<IErc1155RecipeButtonProps> = props => {
  const { recipe } = props;

  const { formatMessage } = useIntl();

  const { library } = useWeb3React();

  const metaLoadRecipe = useMetamask((recipe: IErc1155Recipe) => {
    if (recipe.recipeStatus !== Erc1155RecipeStatus.NEW) {
      return Promise.reject(new Error(""));
    }
    const ids = recipe.ingredients.map(ingredient => ingredient.erc1155TokenId);
    const amounts = recipe.ingredients.map(ingredient => ingredient.amount);

    const contract = new Contract(process.env.ERC1155_CRAFT_ADDR, ERC1155ERC1155Craft.abi, library.getSigner());
    return contract.createRecipe(recipe.id, ids, amounts, recipe.erc1155TokenId) as Promise<void>;
  });

  const handleLoadRecipe = (recipe: IErc1155Recipe): (() => Promise<void>) => {
    return (): Promise<void> => {
      return metaLoadRecipe(recipe).then(() => {
        // TODO reload
      });
    };
  };

  const metaToggleRecipe = useMetamask((recipe: IErc1155Recipe) => {
    let recipeStatus: boolean;
    if (recipe.recipeStatus === Erc1155RecipeStatus.NEW) {
      // this should never happen
      return Promise.reject(new Error(""));
    } else {
      recipeStatus = recipe.recipeStatus !== Erc1155RecipeStatus.ACTIVE;
    }

    const contract = new Contract(process.env.ERC1155_CRAFT_ADDR, ERC1155ERC1155Craft.abi, library.getSigner());
    return contract.updateRecipe(recipe.id, recipeStatus) as Promise<void>;
  });

  const handleToggleRecipe = (recipe: IErc1155Recipe): (() => Promise<void>) => {
    return (): Promise<void> => {
      return metaToggleRecipe(recipe).then(() => {
        // TODO reload
      });
    };
  };

  if (recipe.recipeStatus === Erc1155RecipeStatus.NEW) {
    return (
      <Tooltip title={formatMessage({ id: "pages.erc1155-recipes.upload" })}>
        <IconButton onClick={handleLoadRecipe(recipe)}>
          <Save />
        </IconButton>
      </Tooltip>
    );
  }

  return (
    <Tooltip
      title={formatMessage({
        id:
          recipe.recipeStatus === Erc1155RecipeStatus.ACTIVE
            ? "pages.erc1155-recipes.deactivate"
            : "pages.erc1155-recipes.activate",
      })}
    >
      <IconButton onClick={handleToggleRecipe(recipe)} data-testid="Erc1155RecipeUploadButton">
        <Close />
      </IconButton>
    </Tooltip>
  );
};

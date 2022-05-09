import { FC } from "react";
import { useIntl } from "react-intl";
import { IconButton, Tooltip } from "@mui/material";
import { Close, Save } from "@mui/icons-material";
import { ethers } from "ethers";
import { useWeb3React } from "@web3-react/core";

import { Erc721RecipeStatus, IErc721Recipe } from "@framework/types";
import { useMetamask } from "@gemunion/react-hooks";

import CraftERC721 from "@framework/binance-contracts/artifacts/contracts/Craft/CraftERC721.sol/CraftERC721.json";

export interface IErc721RecipeButtonProps {
  recipe: IErc721Recipe;
}

export const Erc721RecipeUploadButton: FC<IErc721RecipeButtonProps> = props => {
  const { recipe } = props;

  const { formatMessage } = useIntl();

  const { library } = useWeb3React();

  const metaLoadRecipe = useMetamask((recipe: IErc721Recipe) => {
    if (recipe.recipeStatus !== Erc721RecipeStatus.NEW) {
      return Promise.reject(new Error(""));
    }
    const ids = recipe.ingredients.map(ingredient => ingredient.erc1155TokenId);
    const amounts = recipe.ingredients.map(ingredient => ingredient.amount);

    const contract = new ethers.Contract(process.env.ERC721_CRAFT_ADDR, CraftERC721.abi, library.getSigner());
    return contract.createRecipe(
      recipe.id,
      ids,
      amounts,
      recipe.erc721TemplateId,
      recipe.erc721DropboxId,
    ) as Promise<void>;
  });

  const handleLoadRecipe = (recipe: IErc721Recipe): (() => Promise<void>) => {
    return (): Promise<void> => {
      return metaLoadRecipe(recipe).then(() => {
        // TODO reload
      });
    };
  };

  const metaToggleRecipe = useMetamask((recipe: IErc721Recipe) => {
    let recipeStatus: boolean;
    if (recipe.recipeStatus === Erc721RecipeStatus.NEW) {
      // this should never happen
      return Promise.reject(new Error(""));
    } else {
      recipeStatus = recipe.recipeStatus !== Erc721RecipeStatus.ACTIVE;
    }

    const contract = new ethers.Contract(process.env.ERC721_CRAFT_ADDR, CraftERC721.abi, library.getSigner());
    return contract.updateRecipe(recipe.id, recipeStatus) as Promise<void>;
  });

  const handleToggleRecipe = (recipe: IErc721Recipe): (() => Promise<void>) => {
    return (): Promise<void> => {
      return metaToggleRecipe(recipe).then(() => {
        // TODO reload
      });
    };
  };

  if (recipe.recipeStatus === Erc721RecipeStatus.NEW) {
    return (
      <Tooltip title={formatMessage({ id: "pages.erc721-recipes.upload" })}>
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
          recipe.recipeStatus === Erc721RecipeStatus.ACTIVE
            ? "pages.erc721-recipes.deactivate"
            : "pages.erc721-recipes.activate",
      })}
    >
      <IconButton onClick={handleToggleRecipe(recipe)} data-testid="Erc721RecipeUploadButton">
        <Close />
      </IconButton>
    </Tooltip>
  );
};

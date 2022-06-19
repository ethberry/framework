import { FC } from "react";
import { useIntl } from "react-intl";
import { IconButton, Tooltip } from "@mui/material";
import { Check, Close, CloudUpload } from "@mui/icons-material";
import { Contract } from "ethers";
import { useWeb3React } from "@web3-react/core";

import { Erc998RecipeStatus, IErc998Recipe } from "@framework/types";
import { useMetamask } from "@gemunion/react-hooks-eth";

import ERC1155ERC998CraftSol from "@framework/core-contracts/artifacts/contracts/Craft/ERC1155ERC721Craft.sol/ERC1155ERC721Craft.json";

export interface IErc998RecipeButtonProps {
  recipe: IErc998Recipe;
}

export const Erc998RecipeUploadButton: FC<IErc998RecipeButtonProps> = props => {
  const { recipe } = props;

  const { formatMessage } = useIntl();

  const { library } = useWeb3React();

  const metaLoadRecipe = useMetamask((recipe: IErc998Recipe) => {
    if (recipe.recipeStatus !== Erc998RecipeStatus.NEW) {
      return Promise.reject(new Error(""));
    }
    const ids = recipe.ingredients.map(ingredient => ingredient.erc1155TokenId);
    const amounts = recipe.ingredients.map(ingredient => ingredient.amount);

    const contract = new Contract(process.env.ERC721_CRAFT_ADDR, ERC1155ERC998CraftSol.abi, library.getSigner());
    return contract.createRecipe(
      recipe.id,
      recipe.ingredients[0]!.erc1155Token.erc1155Collection!.address,
      ids,
      amounts,
      recipe.erc998TemplateId
        ? recipe.erc998Template!.erc998Collection!.address
        : recipe.erc998Dropbox!.erc998Collection!.address,
      !recipe.erc998TemplateId ? 0 : recipe.erc998TemplateId,
      !recipe.erc998DropboxId ? 0 : recipe.erc998DropboxId,
    ) as Promise<void>;
  });

  const handleLoadRecipe = (recipe: IErc998Recipe): (() => Promise<void>) => {
    return (): Promise<void> => {
      return metaLoadRecipe(recipe).then(() => {
        // TODO reload
      });
    };
  };

  const metaToggleRecipe = useMetamask((recipe: IErc998Recipe) => {
    let recipeStatus: boolean;
    if (recipe.recipeStatus === Erc998RecipeStatus.NEW) {
      // this should never happen
      return Promise.reject(new Error(""));
    } else {
      recipeStatus = recipe.recipeStatus !== Erc998RecipeStatus.ACTIVE;
    }

    const contract = new Contract(process.env.ERC721_CRAFT_ADDR, ERC1155ERC998CraftSol.abi, library.getSigner());
    return contract.updateRecipe(recipe.id, recipeStatus) as Promise<void>;
  });

  const handleToggleRecipe = (recipe: IErc998Recipe): (() => Promise<void>) => {
    return (): Promise<void> => {
      return metaToggleRecipe(recipe).then(() => {
        // TODO reload
      });
    };
  };

  if (recipe.recipeStatus === Erc998RecipeStatus.NEW) {
    return (
      <Tooltip title={formatMessage({ id: "pages.erc998-recipes.upload" })}>
        <IconButton onClick={handleLoadRecipe(recipe)} data-testid="Erc998RecipeUploadButton">
          <CloudUpload />
        </IconButton>
      </Tooltip>
    );
  }

  return (
    <Tooltip
      title={formatMessage({
        id:
          recipe.recipeStatus === Erc998RecipeStatus.ACTIVE
            ? "pages.erc998-recipes.deactivate"
            : "pages.erc998-recipes.activate",
      })}
    >
      <IconButton onClick={handleToggleRecipe(recipe)} data-testid="Erc998RecipeToggleButton">
        {recipe.recipeStatus === Erc998RecipeStatus.ACTIVE ? <Close /> : <Check />}
      </IconButton>
    </Tooltip>
  );
};

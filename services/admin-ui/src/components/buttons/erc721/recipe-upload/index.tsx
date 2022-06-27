import { FC } from "react";
import { useIntl } from "react-intl";
import { IconButton, Tooltip } from "@mui/material";
import { Check, Close, CloudUpload } from "@mui/icons-material";
import { Contract } from "ethers";
import { useWeb3React } from "@web3-react/core";

import { ExchangeStatus, IErc721Recipe } from "@framework/types";
import { useMetamask } from "@gemunion/react-hooks-eth";

import ERC1155ERC721CraftSol from "@framework/core-contracts/artifacts/contracts/Craft/ERC1155ERC721Craft.sol/ERC1155ERC721Craft.json";

export interface IErc721RecipeButtonProps {
  recipe: IErc721Recipe;
}

export const Erc721RecipeUploadButton: FC<IErc721RecipeButtonProps> = props => {
  const { recipe } = props;

  const { formatMessage } = useIntl();

  const { library } = useWeb3React();

  const metaLoadRecipe = useMetamask((recipe: IErc721Recipe) => {
    if (recipe.recipeStatus !== ExchangeStatus.NEW) {
      return Promise.reject(new Error(""));
    }
    const ids = recipe.ingredients.map(ingredient => ingredient.erc1155TokenId);
    const amounts = recipe.ingredients.map(ingredient => ingredient.amount);

    const contract = new Contract(process.env.ERC721_CRAFT_ADDR, ERC1155ERC721CraftSol.abi, library.getSigner());
    return contract.createRecipe(
      recipe.id,
      recipe.ingredients[0]!.erc1155Token.erc1155Collection!.address,
      ids,
      amounts,
      recipe.erc721TemplateId
        ? recipe.erc721Template!.erc721Collection!.address
        : recipe.erc721Dropbox!.erc721Collection!.address,
      !recipe.erc721TemplateId ? 0 : recipe.erc721TemplateId,
      !recipe.erc721DropboxId ? 0 : recipe.erc721DropboxId,
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
    if (recipe.recipeStatus === ExchangeStatus.NEW) {
      // this should never happen
      return Promise.reject(new Error(""));
    } else {
      recipeStatus = recipe.recipeStatus !== ExchangeStatus.ACTIVE;
    }

    const contract = new Contract(process.env.ERC721_CRAFT_ADDR, ERC1155ERC721CraftSol.abi, library.getSigner());
    return contract.updateRecipe(recipe.id, recipeStatus) as Promise<void>;
  });

  const handleToggleRecipe = (recipe: IErc721Recipe): (() => Promise<void>) => {
    return (): Promise<void> => {
      return metaToggleRecipe(recipe).then(() => {
        // TODO reload
      });
    };
  };

  if (recipe.recipeStatus === ExchangeStatus.NEW) {
    return (
      <Tooltip title={formatMessage({ id: "pages.erc721-recipes.upload" })}>
        <IconButton onClick={handleLoadRecipe(recipe)} data-testid="Erc721RecipeUploadButton">
          <CloudUpload />
        </IconButton>
      </Tooltip>
    );
  }

  return (
    <Tooltip
      title={formatMessage({
        id:
          recipe.recipeStatus === ExchangeStatus.ACTIVE
            ? "pages.erc721-recipes.deactivate"
            : "pages.erc721-recipes.activate",
      })}
    >
      <IconButton onClick={handleToggleRecipe(recipe)} data-testid="Erc721RecipeToggleButton">
        {recipe.recipeStatus === ExchangeStatus.ACTIVE ? <Close /> : <Check />}
      </IconButton>
    </Tooltip>
  );
};

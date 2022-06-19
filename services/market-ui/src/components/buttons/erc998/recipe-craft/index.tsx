import { FC, useEffect, useState } from "react";
import { Button } from "@mui/material";
import { FormattedMessage } from "react-intl";
import { Contract } from "ethers";
import { useWeb3React } from "@web3-react/core";

import { useApi } from "@gemunion/provider-api-firebase";
import { useMetamask } from "@gemunion/react-hooks-eth";
import { IErc998Recipe } from "@framework/types";

import ERC1155ERC998CraftSol from "@framework/core-contracts/artifacts/contracts/Craft/ERC1155ERC721Craft.sol/ERC1155ERC721Craft.json";
import ERC998SimpleSol from "@framework/core-contracts/artifacts/contracts/ERC721/ERC721Simple.sol/ERC721Simple.json";

interface IErc998RecipeCraftButtonProps {
  recipe: IErc998Recipe;
}

export const Erc998RecipeCraftButton: FC<IErc998RecipeCraftButtonProps> = props => {
  const { recipe } = props;
  const [isApproved, setIsApproved] = useState(false);

  const { library, active } = useWeb3React();

  const api = useApi();

  const meta = useMetamask(() => {
    const contract = new Contract(
      recipe.erc998Template!.erc998Collection!.address,
      ERC998SimpleSol.abi,
      library.getSigner(),
    );
    return contract.setApprovalForAll(process.env.ERC1155_CRAFT_ADDR, true) as Promise<void>;
  });

  const handleApprove = () => {
    return meta().then(() => {
      setIsApproved(true);
    });
  };

  const handleCraft = useMetamask(() => {
    const contract = new Contract(process.env.ERC721_CRAFT_ADDR, ERC1155ERC998CraftSol.abi, library.getSigner());
    return (
      contract
        // TODO add item amounts - batch craft?
        .craft(recipe.erc998Template?.id, 1) as Promise<void>
    );
  });

  const getApprove = async (): Promise<void> => {
    return api
      .fetchJson({
        url: `/erc1155-token-history/${recipe.ingredients[0].erc1155Token.erc1155Collection!.address}/approve`,
      })
      .then((approve: boolean) => {
        setIsApproved(approve);
      });
  };

  useEffect(() => {
    void getApprove();
  }, []);

  return isApproved ? (
    <Button onClick={handleCraft} disabled={!active} data-testid="Erc1155RecipeCraftButton">
      <FormattedMessage id="form.buttons.craft" />
    </Button>
  ) : (
    <Button onClick={handleApprove} disabled={!active} data-testid="Erc1155RecipeCraftButton">
      <FormattedMessage id="form.buttons.approve" />
    </Button>
  );
};

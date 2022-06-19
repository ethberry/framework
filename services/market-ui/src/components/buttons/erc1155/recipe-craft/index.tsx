import { FC, useEffect, useState } from "react";
import { Button } from "@mui/material";
import { FormattedMessage } from "react-intl";
import { Contract } from "ethers";
import { useWeb3React } from "@web3-react/core";

import { useApi } from "@gemunion/provider-api-firebase";
import { useMetamask } from "@gemunion/react-hooks-eth";
import { IErc1155Recipe } from "@framework/types";

import ERC1155ERC1155CraftSol from "@framework/core-contracts/artifacts/contracts/Craft/ERC1155ERC1155Craft.sol/ERC1155ERC1155Craft.json";
import ERC1155SimpleSol from "@framework/core-contracts/artifacts/contracts/ERC1155/ERC1155Simple.sol/ERC1155Simple.json";

interface IErc1155RecipeCraftButtonProps {
  recipe: IErc1155Recipe;
}

export const Erc1155RecipeCraftButton: FC<IErc1155RecipeCraftButtonProps> = props => {
  const { recipe } = props;
  const [isApproved, setIsApproved] = useState(false);

  const { library, active } = useWeb3React();

  const api = useApi();

  const meta = useMetamask(() => {
    const contract = new Contract(
      recipe.erc1155Token!.erc1155Collection!.address,
      ERC1155SimpleSol.abi,
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
    const contract = new Contract(process.env.ERC1155_CRAFT_ADDR, ERC1155ERC1155CraftSol.abi, library.getSigner());
    return (
      contract
        // TODO add item amounts - batch craft?
        .craft(recipe.erc1155Token?.tokenId, 1) as Promise<void>
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

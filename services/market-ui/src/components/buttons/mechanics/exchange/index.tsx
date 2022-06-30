import { FC, useEffect, useState } from "react";
import { Button } from "@mui/material";
import { FormattedMessage } from "react-intl";
import { Contract } from "ethers";
import { useWeb3React } from "@web3-react/core";

import { useApi } from "@gemunion/provider-api-firebase";
import { useMetamask } from "@gemunion/react-hooks-eth";
import { IExchangeRule } from "@framework/types";

import ERC1155ERC998CraftSol from "@framework/core-contracts/artifacts/contracts/Craft/ERC1155ERC721Craft.sol/ERC1155ERC721Craft.json";
import ERC998SimpleSol from "@framework/core-contracts/artifacts/contracts/ERC721/ERC721Simple.sol/ERC721Simple.json";

interface IExchangeButtonProps {
  rule: IExchangeRule;
}

export const ExchangeButton: FC<IExchangeButtonProps> = props => {
  const { rule } = props;
  const [isApproved, setIsApproved] = useState(false);

  const { library, active } = useWeb3React();

  const api = useApi();

  const meta = useMetamask(() => {
    const contract = new Contract(
      rule.item.components[0].uniContract!.address,
      ERC998SimpleSol.abi,
      library.getSigner(),
    );
    return contract.setApprovalForAll(process.env.EXCHANGE_ADDR, true) as Promise<void>;
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
        .craft(rule.item.components[0].uniTokenId, 1) as Promise<void>
    );
  });

  const getApprove = async (): Promise<void> => {
    return api
      .fetchJson({
        url: `/erc1155-token-history/${rule.ingredients.components[0].uniContract!.address}/approve`,
      })
      .then((approve: boolean) => {
        setIsApproved(approve);
      });
  };

  useEffect(() => {
    void getApprove();
  }, []);

  return isApproved ? (
    <Button onClick={handleCraft} disabled={!active} data-testid="ExchangeCraftButton">
      <FormattedMessage id="form.buttons.craft" />
    </Button>
  ) : (
    <Button onClick={handleApprove} disabled={!active} data-testid="ExchangeCraftButton">
      <FormattedMessage id="form.buttons.approve" />
    </Button>
  );
};

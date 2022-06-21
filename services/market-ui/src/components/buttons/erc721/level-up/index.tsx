import { FC } from "react";
import { Button } from "@mui/material";
import { FormattedMessage } from "react-intl";
import { constants, Contract, utils } from "ethers";
import { useWeb3React } from "@web3-react/core";

import { useApi } from "@gemunion/provider-api-firebase";
import { useMetamask } from "@gemunion/react-hooks-eth";
import { Erc721TokenTemplate, IErc721Token } from "@framework/types";
import { IServerSignature } from "@gemunion/types-collection";

import MetaDataManipulatorSol from "@framework/core-contracts/artifacts/contracts/MetaData/MetaDataManipulator.sol/MetaDataManipulator.json";

interface IErc721LevelUpButtonProps {
  token: IErc721Token;
}

export const Erc721LevelUpButton: FC<IErc721LevelUpButtonProps> = props => {
  const { token } = props;

  const { library, active } = useWeb3React();

  const api = useApi();

  const { contractTemplate, address } = token.erc721Template!.erc721Collection!;

  const handleLevelUp = useMetamask(() => {
    return api
      .fetchJson({
        url: "/erc721-grade/level-up",
        method: "POST",
        data: {
          collection: address,
          tokenId: token.tokenId,
        },
      })
      .then((sign: IServerSignature) => {
        const contract = new Contract(process.env.METADATA_ADDR, MetaDataManipulatorSol.abi, library.getSigner());
        const nonce = utils.arrayify(sign.nonce);
        return contract.levelUp(nonce, address, token.tokenId, sign.signature, {
          value: constants.WeiPerEther,
        }) as Promise<void>;
      });
  });

  if (!(contractTemplate === Erc721TokenTemplate.GRADED || contractTemplate === Erc721TokenTemplate.RANDOM)) {
    return null;
  }

  return (
    <Button onClick={handleLevelUp} disabled={!active} data-testid="Erc721LevelUpButton">
      <FormattedMessage id="form.buttons.levelUp" />
    </Button>
  );
};

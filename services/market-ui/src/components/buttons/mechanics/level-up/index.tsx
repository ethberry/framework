import { FC } from "react";
import { Button } from "@mui/material";
import { FormattedMessage } from "react-intl";
import { constants, Contract, utils } from "ethers";
import { useWeb3React } from "@web3-react/core";

import { useApi } from "@gemunion/provider-api-firebase";
import { useMetamask } from "@gemunion/react-hooks-eth";
import { IUniToken, UniContractTemplate } from "@framework/types";
import { IServerSignature } from "@gemunion/types-collection";

import MetaDataManipulatorSol from "@framework/core-contracts/artifacts/contracts/MetaData/MetaDataManipulator.sol/MetaDataManipulator.json";

interface ILevelUpButtonProps {
  token: IUniToken;
}

export const LevelUpButton: FC<ILevelUpButtonProps> = props => {
  const { token } = props;

  const { library, active } = useWeb3React();

  const api = useApi();

  const { contractTemplate, address } = token.uniTemplate!.uniContract!;

  const handleLevelUp = useMetamask(() => {
    return api
      .fetchJson({
        url: "/erc998-grade/level-up",
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

  if (
    !(
      contractTemplate === UniContractTemplate.ERC998_GRADED ||
      contractTemplate === UniContractTemplate.ERC998_RANDOM
    )
  ) {
    return null;
  }

  return (
    <Button onClick={handleLevelUp} disabled={!active} data-testid="Erc998LevelUpButton">
      <FormattedMessage id="form.buttons.levelUp" />
    </Button>
  );
};

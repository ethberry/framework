import { FC } from "react";
import { Button } from "@mui/material";
import { FormattedMessage } from "react-intl";
import { Contract, utils } from "ethers";
import { useWeb3React } from "@web3-react/core";

import { useApi } from "@gemunion/provider-api-firebase";
import { useMetamask } from "@gemunion/react-hooks-eth";
import { ContractTemplate, IToken, TokenType } from "@framework/types";
import { IServerSignature } from "@gemunion/types-collection";

import ExchangeSol from "@framework/core-contracts/artifacts/contracts/Mechanics/Exchange/Exchange.sol/Exchange.json";

import { emptyPrice } from "../../../inputs/empty-price";

interface IUpgradeButtonProps {
  token: IToken;
}

export const UpgradeButton: FC<IUpgradeButtonProps> = props => {
  const { token } = props;

  const { provider } = useWeb3React();

  const api = useApi();

  const { contractTemplate } = token.template!.contract!;

  // TODO get GradeEntity from server
  const grade = {
    price: emptyPrice,
  };

  const handleLevelUp = useMetamask(() => {
    return api
      .fetchJson({
        url: "/grade/sign",
        method: "POST",
        data: {
          tokenId: token.tokenId,
        },
      })
      .then((sign: IServerSignature) => {
        const contract = new Contract(process.env.EXCHANGE_ADDR, ExchangeSol.abi, provider?.getSigner());
        const nonce = utils.arrayify(sign.nonce);
        return contract.upgrade(
          nonce,
          [
            {
              tokenType: Object.keys(TokenType).indexOf(token.template!.contract!.contractType),
              token: token.template!.contract!.address,
              tokenId: token.tokenId.toString(),
              amount: "1",
            },
          ],
          [
            {
              tokenType: Object.keys(TokenType).indexOf(grade.price.components[0].tokenType),
              token: grade.price.components[0].contract!.address,
              tokenId: grade.price.components[0].template!.tokens![0].tokenId,
              amount: "0", // calculate actual amount
            },
          ],
          process.env.ACCOUNT,
          sign.signature,
          {
            value: 0, // calculate actual value
          },
        ) as Promise<void>;
      });
  });

  if (!(contractTemplate === ContractTemplate.GRADED || contractTemplate === ContractTemplate.RANDOM)) {
    return null;
  }

  return (
    <Button onClick={handleLevelUp} data-testid="ExchangeUpgradeButton">
      <FormattedMessage id="form.buttons.upgrade" />
    </Button>
  );
};

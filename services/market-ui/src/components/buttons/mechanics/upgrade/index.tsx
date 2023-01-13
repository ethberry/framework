import { FC } from "react";
import { Button } from "@mui/material";
import { FormattedMessage } from "react-intl";
import { constants, Contract, utils } from "ethers";
import { Web3ContextType } from "@web3-react/core";

import type { IServerSignature } from "@gemunion/types-blockchain";
import { useApi } from "@gemunion/provider-api-firebase";
import { useMetamask, useServerSignature } from "@gemunion/react-hooks-eth";
import { ContractFeatures, IGrade, IToken, TokenAttributes, TokenType } from "@framework/types";

import ExchangeSol from "@framework/core-contracts/artifacts/contracts/Exchange/Exchange.sol/Exchange.json";
import { getEthPrice, getMultiplier } from "./utils";

interface IUpgradeButtonProps {
  token: IToken;
}

export const UpgradeButton: FC<IUpgradeButtonProps> = props => {
  const { token } = props;

  const api = useApi();

  const { contractFeatures } = token.template!.contract!;

  const metaFnWithSign = useServerSignature((_values: null, web3Context: Web3ContextType, sign: IServerSignature) => {
    return api
      .fetchJson({
        url: `/grade`,
        data: {
          tokenId: token.id,
          attribute: "GRADE",
        },
      })
      .then((grade: IGrade) => {
        const level = token.attributes[TokenAttributes.GRADE];

        const price =
          grade.price?.components.map(component => ({
            tokenType: Object.keys(TokenType).indexOf(component.tokenType),
            token: component.contract!.address,
            tokenId: component.template!.tokens![0].tokenId,
            amount: getMultiplier(level, component.amount, grade),
          })) || [];

        const contract = new Contract(process.env.EXCHANGE_ADDR, ExchangeSol.abi, web3Context.provider?.getSigner());
        return contract.upgrade(
          {
            nonce: utils.arrayify(sign.nonce),
            externalId: grade.id,
            expiresAt: sign.expiresAt,
            referrer: constants.AddressZero,
          },
          {
            tokenType: Object.keys(TokenType).indexOf(token.template!.contract!.contractType),
            token: token.template!.contract!.address,
            tokenId: token.tokenId.toString(),
            amount: "1",
          },
          price,
          sign.signature,
          {
            value: getEthPrice(price),
          },
        ) as Promise<void>;
      });
  });

  const metaFn = useMetamask((web3Context: Web3ContextType) => {
    return metaFnWithSign(
      {
        url: "/grade/sign",
        method: "POST",
        data: {
          tokenId: token.id,
          attribute: "GRADE",
        },
      },
      null,
      web3Context,
    );
  });

  const handleLevelUp = async () => {
    await metaFn();
  };

  if (!contractFeatures.includes(ContractFeatures.UPGRADEABLE)) {
    return null;
  }

  return (
    <Button onClick={handleLevelUp} data-testid="ExchangeUpgradeButton">
      <FormattedMessage id="form.buttons.upgrade" />
    </Button>
  );
};

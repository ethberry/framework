import { FC } from "react";
import { Button } from "@mui/material";
import { FormattedMessage } from "react-intl";
import { constants, Contract, utils } from "ethers";
import { Web3ContextType } from "@web3-react/core";

import type { IServerSignature } from "@gemunion/types-blockchain";
import { useApi } from "@gemunion/provider-api-firebase";
import { useMetamask, useServerSignature } from "@gemunion/react-hooks-eth";
import { ContractFeatures, GradeAttribute, IGrade, IToken, TokenType } from "@framework/types";

import UpgradeABI from "./upgrade.abi.json";
import { getEthPrice, getMultiplier } from "./utils";

interface IUpgradeButtonProps {
  token: IToken;
  attribute: GradeAttribute;
}

export const GradeButton: FC<IUpgradeButtonProps> = props => {
  const { token, attribute } = props;

  const api = useApi();

  const { contractFeatures } = token.template!.contract!;

  const metaFnWithSign = useServerSignature((_values: null, web3Context: Web3ContextType, sign: IServerSignature) => {
    return api
      .fetchJson({
        url: `/grade`,
        data: {
          tokenId: token.id,
          attribute,
        },
      })
      .then((grade: IGrade) => {
        const level = token.attributes[attribute];

        const price =
          grade.price?.components.map(component => ({
            tokenType: Object.keys(TokenType).indexOf(component.tokenType),
            token: component.contract!.address,
            tokenId: component.template!.tokens![0].tokenId,
            amount: getMultiplier(level, component.amount, grade),
          })) || [];

        const contract = new Contract(process.env.EXCHANGE_ADDR, UpgradeABI, web3Context.provider?.getSigner());
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
          attribute,
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
      <FormattedMessage id={`form.buttons.${attribute as string}`} />
    </Button>
  );
};

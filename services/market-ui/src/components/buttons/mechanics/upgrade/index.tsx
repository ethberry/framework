import { FC } from "react";
import { Button } from "@mui/material";
import { FormattedMessage } from "react-intl";
import { BigNumber, Contract, utils } from "ethers";
import { Web3ContextType } from "@web3-react/core";

import { useApi } from "@gemunion/provider-api-firebase";
import { useMetamask, useServerSignature } from "@gemunion/react-hooks-eth";
import { ContractTemplate, GradeStrategy, IGrade, IToken, TokenAttributes, TokenType } from "@framework/types";
import { IServerSignature } from "@gemunion/types-collection";

import ExchangeSol from "@framework/core-contracts/artifacts/contracts/Mechanics/Exchange/Exchange.sol/Exchange.json";

const getMultiplier = (level: number, amount: string, grade: IGrade) => {
  switch (grade.gradeStrategy) {
    case GradeStrategy.FLAT:
      return BigNumber.from(amount);
    case GradeStrategy.LINEAR:
      return BigNumber.from(amount).mul(level);
    case GradeStrategy.EXPONENTIAL:
      return BigNumber.from(amount).mul((1 + grade.growthRate / 100) ** level);
    default:
      throw new Error("unknownStrategy");
  }
};

export const getEthPrice = (price: Array<{ tokenType: number; amount: BigNumber }>) => {
  return price.reduce((memo, current) => {
    if (current.tokenType === 0) {
      return memo.add(current.amount);
    }
    return memo;
  }, BigNumber.from(0));
};

interface IUpgradeButtonProps {
  token: IToken;
}

export const UpgradeButton: FC<IUpgradeButtonProps> = props => {
  const { token } = props;

  const api = useApi();

  const { contractTemplate } = token.template!.contract!;

  const metaFnWithSign = useServerSignature(
    (_values: Record<string, any>, web3Context: Web3ContextType, sign: IServerSignature) => {
      return api
        .fetchJson({
          url: `/grade/${token.id}`,
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
            },
            {
              tokenType: Object.keys(TokenType).indexOf(token.template!.contract!.contractType),
              token: token.template!.contract!.address,
              tokenId: token.tokenId.toString(),
              amount: "1",
            },
            price,
            process.env.ACCOUNT,
            sign.signature,
            {
              value: getEthPrice(price),
            },
          ) as Promise<void>;
        });
    },
  );

  const metaFn = useMetamask((web3Context: Web3ContextType) => {
    return metaFnWithSign(
      {
        url: "/grade/sign",
        method: "POST",
        data: {
          tokenId: token.id,
        },
      },
      web3Context,
    );
  });

  const handleLevelUp = async () => {
    await metaFn();
  };

  if (!(contractTemplate === ContractTemplate.UPGRADEABLE || contractTemplate === ContractTemplate.RANDOM)) {
    return null;
  }

  return (
    <Button onClick={handleLevelUp} data-testid="ExchangeUpgradeButton">
      <FormattedMessage id="form.buttons.upgrade" />
    </Button>
  );
};

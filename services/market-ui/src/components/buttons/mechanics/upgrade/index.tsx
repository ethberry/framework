import { FC } from "react";
import { Button } from "@mui/material";
import { FormattedMessage } from "react-intl";
import { Contract, utils, BigNumber } from "ethers";
import { useWeb3React } from "@web3-react/core";

import { useApi } from "@gemunion/provider-api-firebase";
import { useMetamask } from "@gemunion/react-hooks-eth";
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

export const getEthPrice = (ingredients: Array<{ tokenType: number; amount: BigNumber }>) => {
  return ingredients.reduce((memo, current) => {
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

  const { provider } = useWeb3React();

  const api = useApi();

  const { contractTemplate } = token.template!.contract!;

  const handleLevelUp = useMetamask(() => {
    return api
      .fetchJson({
        url: `/grade/${token.id}`,
      })
      .then((grade: IGrade) => {
        const level = token.attributes[TokenAttributes.GRADE];

        const ingredients = grade.price?.components.map(component => ({
          tokenType: Object.keys(TokenType).indexOf(component.tokenType),
          token: component.contract!.address,
          tokenId: component.template!.tokens![0].tokenId,
          amount: getMultiplier(level, component.amount, grade),
        }));

        return api
          .fetchJson({
            url: "/grade/sign",
            method: "POST",
            data: {
              tokenId: token.id,
            },
          })
          .then((sign: IServerSignature) => {
            const contract = new Contract(process.env.EXCHANGE_ADDR, ExchangeSol.abi, provider?.getSigner());
            const nonce = utils.arrayify(sign.nonce);
            return contract.upgrade(
              nonce,
              {
                externalId: grade.id,
                expiresAt: sign.expiresAt,
              },
              {
                tokenType: Object.keys(TokenType).indexOf(token.template!.contract!.contractType),
                token: token.template!.contract!.address,
                tokenId: token.tokenId.toString(),
                amount: "1",
              },
              ingredients,
              process.env.ACCOUNT,
              sign.signature,
              {
                value: getEthPrice(ingredients),
              },
            ) as Promise<void>;
          });
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

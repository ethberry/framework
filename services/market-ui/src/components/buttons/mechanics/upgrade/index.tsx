import { FC } from "react";
import { Button } from "@mui/material";
import { FormattedMessage } from "react-intl";
import { BigNumber, Contract, utils } from "ethers";
import { Web3ContextType } from "@web3-react/core";

import { useApi } from "@gemunion/provider-api-firebase";
import { useMetamask, useServerSignature } from "@gemunion/react-hooks-eth";
import { ContractFeatures, GradeStrategy, IGrade, IToken, TokenAttributes, TokenType } from "@framework/types";
import { IServerSignature } from "@gemunion/types-collection";

import ExchangeSol from "@framework/core-contracts/artifacts/contracts/Mechanics/Exchange/Exchange.sol/Exchange.json";

const getMultiplier = (level: number, amount: string, { gradeStrategy, growthRate }: IGrade) => {
  if (gradeStrategy === GradeStrategy.FLAT) {
    return BigNumber.from(amount);
  } else if (gradeStrategy === GradeStrategy.LINEAR) {
    return BigNumber.from(amount).mul(level);
  } else if (gradeStrategy === GradeStrategy.EXPONENTIAL) {
    const exp = (1 + growthRate / 100) ** level;
    const [whole = "", decimals = ""] = exp.toString().split(".");
    return BigNumber.from(amount).mul(`${whole}${decimals}`).div(BigNumber.from(10).pow(decimals.length));
  } else {
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

  const { contractFeatures } = token.template!.contract!;

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

  if (!contractFeatures.includes(ContractFeatures.UPGRADEABLE)) {
    return null;
  }

  return (
    <Button onClick={handleLevelUp} data-testid="ExchangeUpgradeButton">
      <FormattedMessage id="form.buttons.upgrade" />
    </Button>
  );
};

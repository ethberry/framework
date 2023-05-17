import { FC, Fragment, useEffect, useState } from "react";
import { Button, Typography } from "@mui/material";
import { FormattedMessage } from "react-intl";
import { constants, Contract, utils, BigNumber } from "ethers";
import { useWeb3React, Web3ContextType } from "@web3-react/core";

import type { IServerSignature } from "@gemunion/types-blockchain";
import { useApi } from "@gemunion/provider-api-firebase";
import { useMetamask, useMetamaskValue, useServerSignature } from "@gemunion/react-hooks-eth";
import { ContractFeatures, GradeAttribute, IGrade, IToken, MetadataHash, TokenType } from "@framework/types";

import UpgradeABI from "../../../../abis/components/buttons/mechanics/grade/upgrade.abi.json";
import GetMetadataABI from "../../../../abis/components/buttons/hierarchy/token/metadata/getMetadata.abi.json";

import { getEthPrice, getMultiplier } from "./utils";
import { sorter } from "../../../../utils/sorter";

interface IUpgradeButtonProps {
  token: IToken;
  attribute: GradeAttribute;
}

export const GradeButton: FC<IUpgradeButtonProps> = props => {
  const { token, attribute } = props;

  const [level, setLevel] = useState("0");

  const api = useApi();
  const { isActive, account } = useWeb3React();

  const { contractFeatures } = token.template!.contract!;

  const metaFnWithSign = useServerSignature(
    (_values: null, web3Context: Web3ContextType, sign: IServerSignature) => {
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
            grade.price?.components.sort(sorter("id")).map(component => ({
              tokenType: Object.values(TokenType).indexOf(component.tokenType),
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
              extra: utils.formatBytes32String("0x"),
            },
            {
              tokenType: Object.values(TokenType).indexOf(token.template!.contract!.contractType),
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
    },
    // { error: false },
  );

  const metaFn = useMetamask((web3Context: Web3ContextType) => {
    return metaFnWithSign(
      {
        url: "/grade/sign",
        method: "POST",
        data: {
          tokenId: token.id,
          attribute,
          account,
        },
      },
      null,
      web3Context,
    );
  });

  const handleLevelUp = async () => {
    await metaFn();
  };

  const metaGetMetadata = useMetamaskValue(async (web3Context: Web3ContextType) => {
    const contract = new Contract(token.template!.contract!.address, GetMetadataABI, web3Context.provider?.getSigner());
    return contract.getTokenMetadata(token.tokenId) as Promise<any>;
  });

  const handleUpdateMetadata = async () => {
    const metadata = await metaGetMetadata();
    const decodedMeta = metadata.reduce(
      (memo: Record<string, string>, current: { key: keyof typeof MetadataHash; value: string }) =>
        Object.assign(memo, {
          [MetadataHash[current.key]]: BigNumber.from(current.value).toString(),
        }),
      {} as Record<string, string>,
    );
    setLevel(decodedMeta.GRADE);
    return decodedMeta.GRADE as string;
  };

  useEffect(() => {
    if (isActive) {
      void handleUpdateMetadata().then(metadata => {
        setLevel(metadata);
      });
    }
  }, [isActive]);

  if (!contractFeatures.includes(ContractFeatures.UPGRADEABLE)) {
    return null;
  }

  return (
    <Fragment>
      <Button onClick={handleLevelUp} data-testid="ExchangeUpgradeButton">
        <FormattedMessage id={`form.buttons.${attribute as string}`} />
      </Button>
      <Button onClick={handleUpdateMetadata} data-testid="GetMetadataButton">
        UPDATE META
      </Button>
      <Typography>
        <FormattedMessage id="pages.erc721.token.level" values={{ level }} />
      </Typography>
    </Fragment>
  );
};

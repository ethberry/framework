import { FC, Fragment, useState } from "react";
import { Button } from "@mui/material";
import { FormattedMessage } from "react-intl";
import { constants, Contract, utils } from "ethers";
import { useWeb3React, Web3ContextType } from "@web3-react/core";

import type { IServerSignature } from "@gemunion/types-blockchain";
import { useApi } from "@gemunion/provider-api-firebase";
import { useMetamask, useServerSignature } from "@gemunion/react-hooks-eth";
import { ContractFeatures, IGrade, IToken, TokenType } from "@framework/types";

import UpgradeABI from "../../../../abis/mechanics/grade/upgrade.abi.json";
import { sorter } from "../../../../utils/sorter";
import { getEthPrice, getMultiplier } from "./utils";
import { IUpgradeDto, UpgradeDialog } from "./dialog";

interface IUpgradeButtonProps {
  token: IToken;
}

export const GradeButton: FC<IUpgradeButtonProps> = props => {
  const { token } = props;

  const [isUpgradeDialogOpen, setIsUpgradeDialogOpen] = useState(false);

  const api = useApi();
  const { account } = useWeb3React();

  const { contractFeatures } = token.template!.contract!;

  const metaFnWithSign = useServerSignature(
    (values: IUpgradeDto, web3Context: Web3ContextType, sign: IServerSignature) => {
      return api
        .fetchJson({
          url: `/grade`,
          data: {
            tokenId: token.id,
            attribute: values.attribute,
          },
        })
        .then((grade: IGrade) => {
          const level = token.metadata[values.attribute] || 0;

          const price =
            grade.price?.components.sort(sorter("id")).map(component => ({
              tokenType: Object.values(TokenType).indexOf(component.tokenType),
              token: component.contract!.address,
              // tokenId: component.templateId || 0,
              tokenId: component.template!.tokens![0].tokenId,
              amount: getMultiplier(level, component.amount, grade),
            })) || [];

          const contract = new Contract(process.env.EXCHANGE_ADDR, UpgradeABI, web3Context.provider?.getSigner());
          return contract.upgrade(
            {
              externalId: grade.id,
              expiresAt: sign.expiresAt,
              nonce: utils.arrayify(sign.nonce),
              extra: utils.hexZeroPad(utils.toUtf8Bytes(values.attribute), 32),
              receiver: constants.AddressZero,
              referrer: constants.AddressZero,
            },
            // ITEM
            {
              tokenType: Object.values(TokenType).indexOf(token.template!.contract!.contractType!),
              token: token.template!.contract!.address,
              tokenId: token.tokenId,
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

  const metaFn = useMetamask((values: IUpgradeDto, web3Context: Web3ContextType) => {
    return metaFnWithSign(
      {
        url: "/grade/sign",
        method: "POST",
        data: {
          tokenId: token.id,
          attribute: values.attribute,
          account,
        },
      },
      values,
      web3Context,
    );
  });

  const handleUpgrade = (): void => {
    setIsUpgradeDialogOpen(true);
  };

  const handleUpgradeConfirm = async (dto: IUpgradeDto): Promise<void> => {
    await metaFn(dto).then(() => {
      setIsUpgradeDialogOpen(false);
    });
  };

  const handleUpgradeCancel = (): void => {
    setIsUpgradeDialogOpen(false);
  };

  if (!contractFeatures.includes(ContractFeatures.UPGRADEABLE)) {
    return null;
  }

  return (
    <Fragment>
      <Button onClick={handleUpgrade} data-testid="ExchangeUpgradeButton">
        <FormattedMessage id={`form.buttons.upgrade`} />
      </Button>
      <UpgradeDialog
        onCancel={handleUpgradeCancel}
        onConfirm={handleUpgradeConfirm}
        open={isUpgradeDialogOpen}
        initialValues={{
          attribute: "",
          contractId: token.template!.contractId,
        }}
      />
    </Fragment>
  );
};

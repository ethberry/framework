import { FC, Fragment, useState } from "react";
import { useWeb3React, Web3ContextType } from "@web3-react/core";
import { constants, Contract, utils } from "ethers";

import type { IServerSignature } from "@gemunion/types-blockchain";
import { useApi } from "@gemunion/provider-api-firebase";
import { useMetamask, useServerSignature } from "@gemunion/react-hooks-eth";

import { ListAction, ListActionVariant } from "@framework/mui-lists";
import type { IContract, IGrade, IToken } from "@framework/types";
import { ContractFeatures, TokenType } from "@framework/types";

import UpgradeABI from "../../../../abis/mechanics/grade/upgrade.abi.json";
import { sorter } from "../../../../utils/sorter";
import { getEthPrice, getMultiplier } from "./utils";
import type { IUpgradeDto } from "./dialog";
import { UpgradeDialog } from "./dialog";

interface IUpgradeButtonProps {
  className?: string;
  disabled?: boolean;
  token: IToken;
  variant?: ListActionVariant;
}

export const GradeButton: FC<IUpgradeButtonProps> = props => {
  const { className, disabled = false, token, variant = ListActionVariant.button } = props;

  const [isUpgradeDialogOpen, setIsUpgradeDialogOpen] = useState(false);

  const api = useApi();
  const { account, chainId } = useWeb3React();

  const { contractFeatures } = token.template!.contract!;

  const metaFnWithSign = useServerSignature(
    (values: IUpgradeDto, web3Context: Web3ContextType, sign: IServerSignature, systemContract: IContract) => {
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

          const contract = new Contract(systemContract.address, UpgradeABI, web3Context.provider?.getSigner());
          return contract.upgrade(
            {
              externalId: grade.id,
              expiresAt: sign.expiresAt,
              nonce: utils.arrayify(sign.nonce),
              extra: utils.hexZeroPad(utils.toUtf8Bytes(values.attribute), 32),
              receiver: grade.contract!.merchant!.wallet,
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
          chainId,
        },
      },
      values,
      web3Context,
    ) as Promise<void>;
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

  if (!contractFeatures.includes(ContractFeatures.DISCRETE)) {
    return null;
  }

  return (
    <Fragment>
      <ListAction
        onClick={handleUpgrade}
        message="form.buttons.upgrade"
        className={className}
        dataTestId="ExchangeUpgradeButton"
        disabled={disabled}
        variant={variant}
      />
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

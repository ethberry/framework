import { FC, Fragment, useState } from "react";
import { Web3ContextType } from "@web3-react/core";
import { constants, Contract, utils } from "ethers";

import type { IServerSignature } from "@gemunion/types-blockchain";
import { useApi } from "@gemunion/provider-api-firebase";
import { useAllowance, useMetamask, useServerSignature } from "@gemunion/react-hooks-eth";
import { ListAction, ListActionVariant } from "@framework/styled";
import type { IContract, IDiscrete, IToken } from "@framework/types";
import { ContractFeatures } from "@framework/types";
import {
  convertDatabaseAssetToChainAsset,
  convertDatabaseAssetToTokenTypeAsset,
  convertTemplateToChainAsset,
} from "@framework/exchange";

import ExchangeGradeFacetUpgradeABI from "@framework/abis/json/ExchangeGradeFacet/upgrade.json";

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

  const { contractFeatures } = token.template!.contract!;

  const metaFnWithAllowance = useAllowance(
    (
      web3Context: Web3ContextType,
      values: IUpgradeDto,
      discrete: IDiscrete,
      sign: IServerSignature,
      systemContract: IContract,
    ) => {
      const level = token.metadata[values.attribute] || 0;

      const item = convertTemplateToChainAsset(token.template, "1");
      const price = convertDatabaseAssetToChainAsset(discrete.price?.components, {
        multiplier: getMultiplier(level, discrete),
      });

      const contract = new Contract(
        systemContract.address,
        ExchangeGradeFacetUpgradeABI,
        web3Context.provider?.getSigner(),
      );

      return contract.upgrade(
        {
          externalId: discrete.id,
          expiresAt: sign.expiresAt,
          nonce: utils.arrayify(sign.nonce),
          extra: utils.hexZeroPad(utils.toUtf8Bytes(values.attribute), 32),
          receiver: discrete.contract!.merchant!.wallet,
          referrer: constants.AddressZero,
        },
        // ITEM
        item,
        price,
        sign.signature,
        {
          value: getEthPrice(price),
        },
      ) as Promise<void>;
    },
  );

  const metaFnWithSign = useServerSignature(
    (values: IUpgradeDto, web3Context: Web3ContextType, sign: IServerSignature, systemContract: IContract) => {
      return api
        .fetchJson({
          url: "/discrete",
          data: {
            tokenId: token.id,
            attribute: values.attribute,
          },
        })
        .then((discrete: IDiscrete) => {
          const level = token.metadata[values.attribute] || 0;
          const price = convertDatabaseAssetToTokenTypeAsset(discrete.price?.components, {
            multiplier: getMultiplier(level, discrete),
          });

          return metaFnWithAllowance(
            [{ contract: systemContract.address, assets: price }],
            web3Context,
            values,
            discrete,
            sign,
            systemContract,
          );
        });
    },
  );

  const metaFn = useMetamask((values: IUpgradeDto, web3Context: Web3ContextType) => {
    return metaFnWithSign(
      {
        url: "/discrete/sign",
        method: "POST",
        data: {
          tokenId: token.id,
          attribute: values.attribute,
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

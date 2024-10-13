import { FC } from "react";
import { useWeb3React, Web3ContextType } from "@web3-react/core";
import { Contract, utils } from "ethers";
import { ShoppingCart } from "@mui/icons-material";

import { useUser } from "@ethberry/provider-user";
import { useAppDispatch, useAppSelector } from "@ethberry/redux";
import { walletActions, walletSelectors } from "@ethberry/provider-wallet";
import { useAllowance, useMetamask, useServerSignature } from "@ethberry/react-hooks-eth";
import type { IServerSignature } from "@ethberry/types-blockchain";
import {
  convertDatabaseAssetToChainAsset,
  convertDatabaseAssetToTokenTypeAsset,
  convertTemplateToChainAsset,
  getEthPrice,
} from "@framework/exchange";
import { ListAction, ListActionVariant } from "@framework/styled";
import { ContractFeatures, IContract, ITemplate, IUser, TemplateStatus } from "@framework/types";

import ExchangePurchaseFacetPurchaseRandomABI from "@framework/abis/json/ExchangePurchaseRandomFacet/purchaseRandom.json";

export interface IAmountDto {
  amount: number;
}

interface ITemplatePurchaseRandomButtonProps {
  className?: string;
  disabled?: boolean;
  template: ITemplate;
  variant?: ListActionVariant;
}

export const TemplatePurchaseRandomButton: FC<ITemplatePurchaseRandomButtonProps> = props => {
  const { className, disabled, template, variant = ListActionVariant.button } = props;

  const { isActive } = useWeb3React();
  const user = useUser<IUser>();
  const isUserAuthenticated = user.isAuthenticated();

  const referrer = useAppSelector(walletSelectors.referrerSelector);
  const dispatch = useAppDispatch();
  const { setIsDialogOpen } = walletActions;

  const metaFnWithAllowance = useAllowance(
    (web3Context: Web3ContextType, values: IAmountDto, sign: IServerSignature, systemContract: IContract) => {
      const contract = new Contract(
        systemContract.address,
        ExchangePurchaseFacetPurchaseRandomABI,
        web3Context.provider?.getSigner(),
      );

      const item = convertTemplateToChainAsset(template, values.amount);
      const price = convertDatabaseAssetToChainAsset(template.price!.components, values.amount);

      return contract.purchaseRandom(
        {
          externalId: template.id,
          expiresAt: sign.expiresAt,
          nonce: utils.arrayify(sign.nonce),
          extra: utils.formatBytes32String("0x"),
          receiver: template.contract!.merchant!.wallet,
          referrer,
        },
        item,
        price,
        sign.signature,
        {
          value: getEthPrice(template.price).mul(values.amount),
        },
      ) as Promise<void>;
    },
  );

  const metaFnWithSign = useServerSignature(
    (values: IAmountDto, web3Context: Web3ContextType, sign: IServerSignature, systemContract: IContract) => {
      const assets = convertDatabaseAssetToTokenTypeAsset(template.price!.components, values.amount);
      return metaFnWithAllowance(
        {
          contract: systemContract.address,
          assets,
        },
        web3Context,
        values,
        sign,
        systemContract,
      );
    },
  );

  const metaFn = useMetamask((values: IAmountDto, web3Context: Web3ContextType) => {
    return metaFnWithSign(
      {
        url: "/marketplace/sign",
        method: "POST",
        data: {
          referrer,
          templateId: template.id,
          amount: values.amount,
        },
      },
      values,
      web3Context,
    ) as Promise<void>;
  });

  const handleConnect = () => {
    void dispatch(setIsDialogOpen(true));
  };

  const handleBuy = async () => {
    await metaFn({
      amount: 1,
    });
  };

  if (template.contract?.contractFeatures.includes(ContractFeatures.EXTERNAL)) {
    return null;
  }

  if (template.templateStatus !== TemplateStatus.ACTIVE) {
    return null;
  }

  const isChainLinkConfigured = template.contract?.parameters.vrfSubId && template.contract?.parameters.isConsumer;

  const isCapExceeded = template.cap !== "0" && BigInt(template.amount) >= BigInt(template.cap);

  return (
    <ListAction
      icon={ShoppingCart}
      onClick={isActive && isUserAuthenticated ? handleBuy : handleConnect}
      message={isActive && isUserAuthenticated ? "form.buttons.buy" : "components.header.wallet.connect"}
      className={className}
      dataTestId="TemplatePurchaseRandomButton"
      disabled={disabled || !isChainLinkConfigured || isCapExceeded}
      variant={variant}
    />
  );
};

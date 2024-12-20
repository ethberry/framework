import { FC, Fragment, useState } from "react";
import { Web3ContextType, useWeb3React } from "@web3-react/core";
import { Contract, utils, constants } from "ethers";
import { ShoppingCart } from "@mui/icons-material";

import { useUser } from "@gemunion/provider-user";
import { useAppDispatch, useAppSelector } from "@gemunion/redux";
import { walletActions, walletSelectors } from "@gemunion/provider-wallet";
import { useMetamask, useServerSignature } from "@gemunion/react-hooks-eth";
import type { IServerSignature } from "@gemunion/types-blockchain";
import {
  convertDatabaseAssetToChainAsset,
  convertDatabaseAssetToTokenTypeAsset,
  convertTemplateToChainAsset,
  getEthPrice,
} from "@framework/exchange";
import { ListAction, ListActionVariant } from "@framework/styled";
import type { IContract, ITemplate, IUser } from "@framework/types";
import { ContractFeatures, TemplateStatus, TokenType } from "@framework/types";

import ExchangePurchaseFacetPurchaseABI from "@framework/abis/json/ExchangePurchaseFacet/purchase.json";

import { useAllowance } from "../../../../../utils/use-allowance";
import { AmountDialog, IAmountDto } from "./dialog";

interface ITemplatePurchaseButtonProps {
  className?: string;
  disabled?: boolean;
  template: ITemplate;
  variant?: ListActionVariant;
}

export const TemplatePurchaseButton: FC<ITemplatePurchaseButtonProps> = props => {
  const { className, disabled, template, variant = ListActionVariant.button } = props;

  const { isActive } = useWeb3React();
  const user = useUser<IUser>();
  const isUserAuthenticated = user.isAuthenticated();

  const [isAmountDialogOpen, setIsAmountDialogOpen] = useState(false);
  const referrer = useAppSelector(walletSelectors.referrerSelector);
  const dispatch = useAppDispatch();
  const { setIsDialogOpen } = walletActions;

  const metaFnWithAllowance = useAllowance(
    (web3Context: Web3ContextType, values: IAmountDto, sign: IServerSignature, systemContract: IContract) => {
      const contract = new Contract(
        systemContract.address,
        ExchangePurchaseFacetPurchaseABI,
        web3Context.provider?.getSigner(),
      );

      const item = convertTemplateToChainAsset(template, values.amount);
      const price = convertDatabaseAssetToChainAsset(template.price?.components, { multiplier: values.amount });

      return contract.purchase(
        {
          externalId: template.id,
          expiresAt: sign.expiresAt,
          nonce: utils.arrayify(sign.nonce),
          extra: utils.formatBytes32String("0x"),
          receiver: template.contract!.merchant!.wallet,
          referrer: referrer || constants.AddressZero,
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
      const assets = convertDatabaseAssetToTokenTypeAsset(template.price?.components, {
        multiplier: values.amount,
      });
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
    if (template.contract!.contractType === TokenType.ERC1155) {
      setIsAmountDialogOpen(true);
    } else {
      await metaFn({
        amount: 1,
      });
    }
  };

  const handleAmountConfirm = async (dto: IAmountDto): Promise<void> => {
    await metaFn(dto).then(() => {
      setIsAmountDialogOpen(false);
    });
  };

  const handleAmountCancel = (): void => {
    setIsAmountDialogOpen(false);
  };

  if (template.contract?.contractFeatures.includes(ContractFeatures.EXTERNAL)) {
    return null;
  }

  if (template.templateStatus !== TemplateStatus.ACTIVE) {
    return null;
  }

  // Random contract must be registered in Chain-link VRF
  // TODO may-be hide BUY button completely, but it brakes formatting
  let rndBuyEnabled = true;
  if (
    (template.contract?.contractFeatures.includes(ContractFeatures.RANDOM) ||
      template.contract?.contractFeatures.includes(ContractFeatures.GENES)) &&
    (!template.contract?.parameters.vrfSubId || !template.contract?.parameters.isConsumer)
  ) {
    rndBuyEnabled = false;
  }

  return (
    <Fragment>
      <ListAction
        icon={ShoppingCart}
        onClick={isActive && isUserAuthenticated ? handleBuy : handleConnect}
        message={isActive && isUserAuthenticated ? "form.buttons.buy" : "components.header.wallet.connect"}
        className={className}
        dataTestId="TemplatePurchaseButton"
        disabled={
          disabled || !rndBuyEnabled || (template.cap !== "0" && BigInt(template.amount) >= BigInt(template.cap))
        }
        variant={variant}
      />
      <AmountDialog
        onCancel={handleAmountCancel}
        onConfirm={handleAmountConfirm}
        open={isAmountDialogOpen}
        initialValues={{
          amount: 1,
        }}
      />
    </Fragment>
  );
};

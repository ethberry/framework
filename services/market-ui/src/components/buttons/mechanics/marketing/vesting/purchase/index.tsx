import { FC } from "react";
import { useWeb3React, Web3ContextType } from "@web3-react/core";
import { constants, Contract, utils } from "ethers";

import type { IServerSignature } from "@ethberry/types-blockchain";
import { useAppDispatch, useAppSelector } from "@ethberry/redux";
import { walletActions, walletSelectors } from "@ethberry/provider-wallet";
import { useUser } from "@ethberry/provider-user";
import { useAllowance, useMetamask, useServerSignature } from "@ethberry/react-hooks-eth";
import { TokenType } from "@ethberry/types-blockchain";
import { convertDatabaseAssetToChainAsset, convertDatabaseAssetToTokenTypeAsset } from "@framework/exchange";
import { ListAction, ListActionVariant } from "@framework/styled";
import { IContract, IUser, IVestingBox, VestingType } from "@framework/types";

import VestingBoxPurchaseABI from "@framework/abis/json/ExchangeVestingFacet/purchaseVesting.json";

interface IMysteryBoxBuyButtonProps {
  className?: string;
  disabled?: boolean;
  vestingBox: IVestingBox;
  variant?: ListActionVariant;
}

export const VestingBoxPurchaseButton: FC<IMysteryBoxBuyButtonProps> = props => {
  const { className, disabled, vestingBox, variant = ListActionVariant.button } = props;

  const { isActive } = useWeb3React();
  const user = useUser<IUser>();
  const isUserAuthenticated = user.isAuthenticated();

  const referrer = useAppSelector(walletSelectors.referrerSelector);
  const dispatch = useAppDispatch();
  const { setIsDialogOpen } = walletActions;

  const metaFnWithAllowance = useAllowance(
    (web3Context: Web3ContextType, sign: IServerSignature, systemContract: IContract) => {
      const contract = new Contract(systemContract.address, VestingBoxPurchaseABI, web3Context.provider?.getSigner());

      const content = convertDatabaseAssetToChainAsset(vestingBox.content!.components);
      const price = convertDatabaseAssetToChainAsset(vestingBox.template!.price!.components);

      return contract.purchaseVesting(
        {
          externalId: vestingBox.id,
          expiresAt: sign.expiresAt,
          nonce: utils.arrayify(sign.nonce),
          extra: utils.formatBytes32String("0x"),
          receiver: vestingBox.template!.contract!.merchant!.wallet,
          referrer: constants.AddressZero,
        },
        {
          tokenType: Object.values(TokenType).indexOf(TokenType.ERC721),
          token: vestingBox.template!.contract!.address,
          tokenId: vestingBox.templateId,
          amount: "1",
        },
        price,
        content,
        {
          functionType: Object.values(VestingType).indexOf(vestingBox.shape.split("_")[0] as VestingType),
          cliff: vestingBox.cliff,
          startTimestamp: vestingBox.startTimestamp,
          duration: vestingBox.duration,
          period: vestingBox.period,
          afterCliffBasisPoints: vestingBox.afterCliffBasisPoints,
          growthRate: vestingBox.growthRate,
        },
        sign.signature,
      ) as Promise<void>;
    },
  );

  const metaFnWithSign = useServerSignature(
    (_values: null, web3Context: Web3ContextType, sign: IServerSignature, systemContract: IContract) => {
      const price = convertDatabaseAssetToTokenTypeAsset(vestingBox.template!.price!.components);

      return metaFnWithAllowance(
        { contract: systemContract.address, assets: price },
        web3Context,
        sign,
        systemContract,
      );
    },
  );

  const metaFn = useMetamask((web3Context: Web3ContextType) => {
    return metaFnWithSign(
      {
        url: "/vesting/sign",
        method: "POST",
        data: {
          referrer,
          vestingBoxId: vestingBox.id,
        },
      },
      null,
      web3Context,
    ) as Promise<void>;
  });

  const handleBuy = async () => {
    await metaFn();
  };

  const handleConnect = () => {
    void dispatch(setIsDialogOpen(true));
  };

  return (
    <ListAction
      onClick={isActive && isUserAuthenticated ? handleBuy : handleConnect}
      message={isActive && isUserAuthenticated ? "form.buttons.buy" : "components.header.wallet.connect"}
      className={className}
      dataTestId="VestingPurchaseButton"
      disabled={disabled || vestingBox.template?.cap !== "0"}
      variant={variant}
    />
  );
};

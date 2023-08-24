import { FC } from "react";
import { Button } from "@mui/material";
import { Web3ContextType } from "@web3-react/core";
import { Contract, utils } from "ethers";
import { FormattedMessage } from "react-intl";

import type { IServerSignature } from "@gemunion/types-blockchain";
import { useSettings } from "@gemunion/provider-settings";
import { IDrop, TokenType, ModuleType, IMysteryBox } from "@framework/types";
import { useMetamask, useServerSignature } from "@gemunion/react-hooks-eth";

import DropPurchaseABI from "../../../../../abis/mechanics/drop/purchase/purchase.abi.json";

import { getEthPrice } from "../../../../../utils/money";
import { sorter } from "../../../../../utils/sorter";

interface IDropWithMystery extends IDrop {
  box?: IMysteryBox;
}

interface IDropPurchaseButtonProps {
  drop: IDropWithMystery;
}

export const DropPurchaseButton: FC<IDropPurchaseButtonProps> = props => {
  const { drop } = props;

  const mysteryComponents = drop.item?.components.filter(
    component => component.contract!.contractModule === ModuleType.MYSTERY,
  );

  const settings = useSettings();

  const metaFnWithSign = useServerSignature(
    (_values: null, web3Context: Web3ContextType, sign: IServerSignature) => {
      const contract = new Contract(process.env.EXCHANGE_ADDR, DropPurchaseABI, web3Context.provider?.getSigner());

      return mysteryComponents && mysteryComponents.length > 0
        ? (contract.purchaseMystery(
            {
              externalId: drop.id,
              expiresAt: sign.expiresAt,
              nonce: utils.arrayify(sign.nonce),
              extra: utils.formatBytes32String("0x"),
              receiver: drop.merchant!.wallet,
              referrer: settings.getReferrer(),
            },
            [
              ...drop.box!.item!.components.sort(sorter("id")).map(component => ({
                tokenType: Object.values(TokenType).indexOf(component.tokenType),
                token: component.contract!.address,
                // tokenId: component.templateId || 0,
                tokenId:
                  component.contract!.contractType === TokenType.ERC1155
                    ? component.template!.tokens![0].tokenId
                    : (component.templateId || 0).toString(),
                amount: component.amount,
              })),
              drop.item?.components.sort(sorter("id")).map(component => ({
                tokenType: Object.values(TokenType).indexOf(component.tokenType),
                token: component.contract!.address,
                tokenId: (component.templateId || 0).toString(), // suppression types check with 0
                amount: component.amount,
              }))[0],
            ],
            drop.price?.components.sort(sorter("id")).map(component => ({
              tokenType: Object.values(TokenType).indexOf(component.tokenType),
              token: component.contract!.address,
              tokenId: component.template!.tokens![0].tokenId,
              amount: component.amount,
            })),
            sign.signature,
            {
              value: getEthPrice(drop.price),
            },
          ) as Promise<void>)
        : (contract.purchase(
            {
              externalId: drop.id,
              expiresAt: sign.expiresAt,
              nonce: utils.arrayify(sign.nonce),
              extra: utils.formatBytes32String("0x"),
              receiver: drop.merchant!.wallet,
              referrer: settings.getReferrer(),
            },
            drop.item?.components.sort(sorter("id")).map(component => ({
              tokenType: Object.values(TokenType).indexOf(component.tokenType),
              token: component.contract!.address,
              tokenId: (component.templateId || 0).toString(), // suppression types check with 0
              amount: component.amount,
            }))[0],
            drop.price?.components.sort(sorter("id")).map(component => ({
              tokenType: Object.values(TokenType).indexOf(component.tokenType),
              token: component.contract!.address,
              tokenId: component.template!.tokens![0].tokenId,
              amount: component.amount,
            })),
            sign.signature,
            {
              value: getEthPrice(drop.price),
            },
          ) as Promise<void>);
    },
    // { error: false },
  );

  const metaFn = useMetamask((web3Context: Web3ContextType) => {
    const { chainId, account } = web3Context;

    return metaFnWithSign(
      {
        url: "/drops/sign",
        method: "POST",
        data: {
          chainId,
          account,
          referrer: settings.getReferrer(),
          dropId: drop.id,
        },
      },
      null,
      web3Context,
    );
  });

  const handleBuy = async () => {
    await metaFn();
  };

  return (
    <Button onClick={handleBuy} data-testid="DropPurchaseButton">
      <FormattedMessage id="form.buttons.buy" />
    </Button>
  );
};

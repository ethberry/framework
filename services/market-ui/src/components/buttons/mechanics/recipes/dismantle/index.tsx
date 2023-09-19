import { FC } from "react";
import { useNavigate } from "react-router";
import { Web3ContextType } from "@web3-react/core";
import { constants, Contract, utils } from "ethers";

import type { IServerSignature } from "@gemunion/types-blockchain";
import { useSettings } from "@gemunion/provider-settings";
import { useMetamask, useServerSignature } from "@gemunion/react-hooks-eth";
import { ListAction, ListActionVariant } from "@framework/mui-lists";
import type { IDismantle, IToken } from "@framework/types";
import { TokenType } from "@framework/types";

import DismantleABI from "../../../../../abis/mechanics/dismantle/dismantle.abi.json";

// import { getEthPrice } from "../../../../../utils/money";
import { sorter } from "../../../../../utils/sorter";
import { getDismantleMultiplier } from "./utils";

interface IDismantleButtonProps {
  className?: string;
  disabled?: boolean;
  token: IToken;
  dismantle: IDismantle;
  variant?: ListActionVariant;
}

export const DismantleButton: FC<IDismantleButtonProps> = props => {
  const { className, disabled, token, dismantle, variant = ListActionVariant.button } = props;

  const navigate = useNavigate();
  const settings = useSettings();

  const metaFnWithSign = useServerSignature(
    (dismantle: IDismantle, web3Context: Web3ContextType, sign: IServerSignature) => {
      const contract = new Contract(process.env.EXCHANGE_ADDR, DismantleABI, web3Context.provider?.getSigner());

      return contract.dismantle(
        {
          externalId: dismantle.id,
          expiresAt: sign.expiresAt,
          nonce: utils.arrayify(sign.nonce),
          extra: utils.formatBytes32String("0x"),
          receiver: dismantle.merchant!.wallet,
          referrer: constants.AddressZero,
        },
        // ITEM to get after dismantle
        dismantle.item?.components.sort(sorter("id")).map(component => ({
          tokenType: Object.values(TokenType).indexOf(component.tokenType),
          token: component.contract!.address,
          tokenId:
            component.contract!.contractType === TokenType.ERC1155
              ? component.template!.tokens![0].tokenId
              : (component.templateId || 0).toString(), // suppression types check with 0
          amount: getDismantleMultiplier(
            component.amount,
            token.metadata,
            dismantle.dismantleStrategy,
            dismantle.rarityMultiplier,
          ).amount.toString(),
        })),
        // PRICE token to dismantle
        dismantle.price?.components.sort(sorter("id")).map(component => ({
          tokenType: Object.values(TokenType).indexOf(component.tokenType),
          token: component.contract!.address,
          tokenId: token.tokenId,
          amount: component.amount,
        }))[0],
        sign.signature,
        // { dismantle cost not implemented
        //   value: getEthPrice(dismantle.item),
        // },
      ) as Promise<void>;
    },
    // { error: false },
  );

  const metaFn = useMetamask((dismantle: IDismantle, web3Context: Web3ContextType) => {
    const { chainId, account } = web3Context;

    return metaFnWithSign(
      {
        url: "/dismantle/sign",
        method: "POST",
        data: {
          chainId,
          account,
          referrer: settings.getReferrer(),
          dismantleId: dismantle.id,
          tokenId: token.id,
        },
      },
      dismantle,
      web3Context,
    ).then(() => {
      navigate("/tokens");
    });
  });

  const handleDismantle = async () => {
    await metaFn(dismantle);
  };

  return (
    <ListAction
      onClick={handleDismantle}
      message="form.buttons.dismantle"
      className={className}
      dataTestId="ExchangeDismantleButton"
      disabled={disabled}
      variant={variant}
    />
  );
};

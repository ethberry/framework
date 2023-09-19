import { FC } from "react";
import { Web3ContextType } from "@web3-react/core";
import { Casino } from "@mui/icons-material";
import { Contract, utils } from "ethers";

import type { IServerSignature } from "@gemunion/types-blockchain";
import { useMetamask, useServerSignature, useSystemContract } from "@gemunion/react-hooks-eth";
import { useSettings } from "@gemunion/provider-settings";
import { ListAction, ListActionVariant } from "@framework/mui-lists";
import type { IContract, IRaffleRound } from "@framework/types";
import { SystemModuleType, TokenType } from "@framework/types";

import RafflePurchaseABI from "../../../../../abis/mechanics/raffle/purchase/purchase.abi.json";
import { getEthPrice } from "../../../../../utils/money";

export interface IRafflePurchaseButtonProps {
  className?: string;
  disabled: boolean;
  round: Partial<IRaffleRound>;
  variant?: ListActionVariant;
}

export const RafflePurchaseButton: FC<IRafflePurchaseButtonProps> = props => {
  const { className, disabled, round, variant = ListActionVariant.button } = props;

  const settings = useSettings();

  const metaFnWithSign = useServerSignature(
    (_values: null, web3Context: Web3ContextType, sign: IServerSignature, systemContract: IContract) => {
      const contract = new Contract(systemContract.address, RafflePurchaseABI, web3Context.provider?.getSigner());

      return contract.purchaseRaffle(
        {
          externalId: round.id,
          expiresAt: sign.expiresAt,
          nonce: utils.arrayify(sign.nonce),
          extra: utils.formatBytes32String("0x"),
          receiver: round.contract?.address,
          referrer: settings.getReferrer(),
        },
        {
          tokenType: 2,
          token: round.ticketContract?.address,
          tokenId: "0",
          amount: "1",
        },
        round.price?.components.map(component => ({
          tokenType: Object.values(TokenType).indexOf(component.tokenType),
          token: component.contract?.address,
          tokenId: component.template?.tokens![0].tokenId,
          amount: component.amount,
        }))[0],
        sign.signature,
        {
          value: getEthPrice(round.price),
        },
      ) as Promise<void>;
    },
    // { error: false },
  );

  const metaFnWithContract = useSystemContract<IContract, SystemModuleType>(
    (_values: null, web3Context: Web3ContextType, systemContract: IContract) => {
      const { chainId, account } = web3Context;

      return metaFnWithSign(
        {
          url: "/raffle/ticket/sign",
          method: "POST",
          data: {
            chainId,
            account,
            referrer: settings.getReferrer(),
            contractId: round.contractId,
          },
        },
        null,
        web3Context,
        systemContract,
      ) as Promise<void>;
    },
  );

  const metaFn = useMetamask((web3Context: Web3ContextType) => {
    return metaFnWithContract(SystemModuleType.EXCHANGE, null, web3Context);
  });

  const handlePurchase = () => {
    return metaFn();
  };

  return (
    <ListAction
      onClick={handlePurchase}
      icon={Casino}
      message="form.buttons.buy"
      buttonVariant="contained"
      className={className}
      dataTestId="RafflePurchaseButton"
      disabled={disabled}
      variant={variant}
    />
  );
};

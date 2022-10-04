import { FC } from "react";
import { Web3ContextType } from "@web3-react/core";
import { Button } from "@mui/material";
import { Casino } from "@mui/icons-material";
import { FormattedMessage } from "react-intl";
import { constants, Contract, utils } from "ethers";

import type { IServerSignature } from "@gemunion/types-collection";
import { useMetamask, useServerSignature } from "@gemunion/react-hooks-eth";
import { useSettings } from "@gemunion/provider-settings";

import LotterySol from "@framework/core-contracts/artifacts/contracts/Mechanics/Lottery/Lottery.sol/Lottery.json";

export interface ILotteryPurchaseButtonProps {
  ticketNumbers: Array<boolean>;
  clearForm: () => void;
}

export const LotteryPurchaseButton: FC<ILotteryPurchaseButtonProps> = props => {
  const { clearForm, ticketNumbers } = props;

  const settings = useSettings();

  const metaFnWithSign = useServerSignature((_values: null, web3Context: Web3ContextType, sign: IServerSignature) => {
    const contract = new Contract(process.env.LOTTERY_ADDR, LotterySol.abi, web3Context.provider?.getSigner());
    return contract
      .purchase(
        {
          nonce: utils.arrayify(sign.nonce),
          externalId: 0,
          expiresAt: sign.expiresAt,
          referrer: settings.getReferrer(),
        },
        ticketNumbers,
        constants.WeiPerEther,
        process.env.ACCOUNT,
        sign.signature,
      )
      .then(clearForm) as Promise<void>;
  });

  const metaFn = useMetamask((web3Context: Web3ContextType) => {
    const { account } = web3Context;

    return metaFnWithSign(
      {
        url: "/lottery/ticket/sign",
        method: "POST",
        data: {
          ticketNumbers,
          account,
          referrer: settings.getReferrer(),
        },
      },
      null,
      web3Context,
    );
  });

  const handlePurchase = () => {
    return metaFn();
  };

  return (
    <Button startIcon={<Casino />} onClick={handlePurchase} data-testid="LotteryBuyTicket">
      <FormattedMessage id="form.buttons.buy" />
    </Button>
  );
};

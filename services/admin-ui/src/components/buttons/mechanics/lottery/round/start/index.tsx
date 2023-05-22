import { FC, Fragment, useState } from "react";
import { Web3ContextType } from "@web3-react/core";
import { Button } from "@mui/material";
import { PlayCircleOutline } from "@mui/icons-material";
import { FormattedMessage } from "react-intl";
import { Contract } from "ethers";

import { useMetamask } from "@gemunion/react-hooks-eth";
import { emptyPrice, emptyItem } from "@gemunion/mui-inputs-asset";

import { TokenType } from "@framework/types";

import LotteryStartRoundABI from "../../../../../../abis/components/buttons/mechanics/lottery/round/start/startRound.abi.json";
import { ILotteryRound, LotteryStartRoundDialog } from "./round-dialog";

export const LotteryRoundStartButton: FC = () => {
  const [isStartRoundDialogOpen, setIsStartRoundDialogOpen] = useState(false);

  const metaFn = useMetamask((values: ILotteryRound, web3Context: Web3ContextType) => {
    const contract = new Contract(values.address, LotteryStartRoundABI, web3Context.provider?.getSigner());

    const ticket = {
      tokenType: Object.values(TokenType).indexOf(values.ticket.components[0].tokenType),
      token: values.ticket.components[0].contract!.address,
      tokenId: values.ticket.components[0].templateId || 0,
      amount: 1,
    };
    const price = {
      tokenType: Object.values(TokenType).indexOf(values.price.components[0].tokenType),
      token: values.price.components[0].contract!.address,
      tokenId: values.price.components[0].templateId || 0,
      amount: values.price.components[0].amount,
    };
    return contract.startRound(ticket, price) as Promise<void>;
  });

  const handleStartRoundConfirm = async (values: ILotteryRound): Promise<void> => {
    return metaFn(values);
  };

  const handleStartRound = () => {
    setIsStartRoundDialogOpen(true);
  };

  const handleStartRoundCancel = () => {
    setIsStartRoundDialogOpen(false);
  };

  if (process.env.NODE_ENV === "production") {
    return null;
  }

  return (
    <Fragment>
      <Button startIcon={<PlayCircleOutline />} onClick={handleStartRound} data-testid="LotteryRoundStartButton">
        <FormattedMessage id="pages.lottery.rounds.start" />
      </Button>
      <LotteryStartRoundDialog
        onConfirm={handleStartRoundConfirm}
        onCancel={handleStartRoundCancel}
        open={isStartRoundDialogOpen}
        initialValues={{
          address: "",
          ticket: emptyItem,
          price: emptyPrice,
        }}
      />
    </Fragment>
  );
};

import { FC, Fragment, useState } from "react";
import { Web3ContextType } from "@web3-react/core";
import { Button } from "@mui/material";
import { StopCircleOutlined } from "@mui/icons-material";
import { FormattedMessage } from "react-intl";
import { Contract } from "ethers";

import { useMetamask } from "@gemunion/react-hooks-eth";

import LotteryEndRoundABI from "../../../../../../abis/components/buttons/mechanics/lottery/round/end/endRound.abi.json";
import { ILotteryEndRound, LotteryEndRoundDialog } from "./dialog";

export const LotteryRoundEndButton: FC = () => {
  const [isEndRoundDialogOpen, setIsEndRoundDialogOpen] = useState(false);

  const metaFn = useMetamask((values: ILotteryEndRound, web3Context: Web3ContextType) => {
    const contract = new Contract(values.address, LotteryEndRoundABI, web3Context.provider?.getSigner());
    return contract.endRound() as Promise<void>;
  });

  const handleEndRound = () => {
    setIsEndRoundDialogOpen(true);
  };

  const handleEndRoundConfirm = async (values: ILotteryEndRound) => {
    return metaFn(values);
  };

  const handleEndRoundCancel = () => {
    setIsEndRoundDialogOpen(false);
  };

  if (process.env.NODE_ENV === "production") {
    return null;
  }

  return (
    <Fragment>
      <Button startIcon={<StopCircleOutlined />} onClick={handleEndRound} data-testid="LotteryRoundEndButton">
        <FormattedMessage id="pages.lottery.rounds.end" />
      </Button>
      <LotteryEndRoundDialog
        onConfirm={handleEndRoundConfirm}
        onCancel={handleEndRoundCancel}
        open={isEndRoundDialogOpen}
        initialValues={{
          address: "",
        }}
      />
    </Fragment>
  );
};

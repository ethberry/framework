import { FC, Fragment, useState } from "react";
import { Web3ContextType } from "@web3-react/core";
import { PlayCircleOutline } from "@mui/icons-material";
import { Contract } from "ethers";

import { useMetamask } from "@gemunion/react-hooks-eth";
import { emptyItem, emptyPrice } from "@gemunion/mui-inputs-asset";

import type { IContract } from "@framework/types";
import { NodeEnv, TokenType } from "@framework/types";

import RaffleStartRoundABI from "../../../../../../abis/mechanics/raffle/round/start/startRound.abi.json";

import { ListAction, ListActionVariant } from "../../../../../common/lists";
import { IRaffleRound, RaffleStartRoundDialog } from "./round-dialog";

export interface IRaffleRoundStartMenuItemProps {
  contract: IContract;
  disabled?: boolean;
  variant?: ListActionVariant;
}

export const RaffleRoundStartMenuItem: FC<IRaffleRoundStartMenuItemProps> = props => {
  const {
    contract: { address, id },
    disabled,
    variant,
  } = props;

  const [isStartRoundDialogOpen, setIsStartRoundDialogOpen] = useState(false);

  const metaFn = useMetamask((values: IRaffleRound, web3Context: Web3ContextType) => {
    const contract = new Contract(address, RaffleStartRoundABI, web3Context.provider?.getSigner());

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
    return contract.startRound(ticket, price, values.maxTicket) as Promise<void>;
  });

  const handleStartRoundConfirm = async (values: IRaffleRound): Promise<void> => {
    return metaFn(values).finally(() => {
      setIsStartRoundDialogOpen(false);
    });
  };

  const handleStartRound = () => {
    setIsStartRoundDialogOpen(true);
  };

  const handleStartRoundCancel = () => {
    setIsStartRoundDialogOpen(false);
  };

  if (process.env.NODE_ENV === NodeEnv.production) {
    return null;
  }

  return (
    <Fragment>
      <ListAction
        onClick={handleStartRound}
        dataTestId="RaffleRoundStartButton"
        icon={PlayCircleOutline}
        message="pages.raffle.rounds.start"
        disabled={disabled}
        variant={variant}
      />
      <RaffleStartRoundDialog
        onConfirm={handleStartRoundConfirm}
        onCancel={handleStartRoundCancel}
        open={isStartRoundDialogOpen}
        initialValues={{
          contractId: id,
          address,
          ticket: emptyItem,
          price: emptyPrice,
          maxTicket: 0,
        }}
      />
    </Fragment>
  );
};

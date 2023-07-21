import { FC, Fragment, useState } from "react";
import { Web3ContextType } from "@web3-react/core";
import { ListItemIcon, MenuItem, Typography } from "@mui/material";
import { PlayCircleOutline } from "@mui/icons-material";
import { FormattedMessage } from "react-intl";
import { Contract } from "ethers";

import { useMetamask } from "@gemunion/react-hooks-eth";
import { emptyItem, emptyPrice } from "@gemunion/mui-inputs-asset";

import { IContract, TokenType } from "@framework/types";

import RaffleStartRoundABI from "../../../../../../abis/mechanics/raffle/round/start/startRound.abi.json";
import { IRaffleRound, RaffleStartRoundDialog } from "./round-dialog";

export interface IRaffleRoundStartMenuItemProps {
  contract: IContract;
}

export const RaffleRoundStartMenuItem: FC<IRaffleRoundStartMenuItemProps> = props => {
  const {
    contract: { address, id },
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

  if (process.env.NODE_ENV === "production") {
    return null;
  }

  return (
    <Fragment>
      <MenuItem onClick={handleStartRound} data-testid="RaffleRoundStartButton">
        <ListItemIcon>
          <PlayCircleOutline fontSize="small" />
        </ListItemIcon>
        <Typography variant="inherit">
          <FormattedMessage id="pages.raffle.rounds.start" />
        </Typography>
      </MenuItem>
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

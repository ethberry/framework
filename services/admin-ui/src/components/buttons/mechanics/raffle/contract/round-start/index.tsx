import { FC, Fragment, useState } from "react";
import { Web3ContextType } from "@web3-react/core";
import { PlayCircleOutline } from "@mui/icons-material";
import { Contract } from "ethers";

import { ListAction, ListActionVariant } from "@framework/styled";
import type { IContract } from "@framework/types";
import { AccessControlRoleType, TokenType } from "@framework/types";
import { useMetamask } from "@gemunion/react-hooks-eth";
import { emptyItem, emptyPrice } from "@gemunion/mui-inputs-asset";

import RaffleRandomStartRoundABI from "@framework/abis/json/RaffleRandom/startRound.json";

import { RaffleStartRoundDialog } from "./round-dialog";
import type { IRaffleRound } from "./round-dialog";
import { shouldDisableByContractType } from "../../../../utils";
import { useSetButtonPermission } from "../../../../../../shared";

export interface IRaffleRoundStartButtonProps {
  className?: string;
  contract: IContract;
  disabled?: boolean;
  variant?: ListActionVariant;
}

export const RaffleRoundStartButton: FC<IRaffleRoundStartButtonProps> = props => {
  const {
    className,
    contract,
    contract: { address, id, parameters },
    disabled,
    variant,
  } = props;

  const [isStartRoundDialogOpen, setIsStartRoundDialogOpen] = useState(false);

  const { hasPermission } = useSetButtonPermission(AccessControlRoleType.DEFAULT_ADMIN_ROLE, contract?.id);

  const metaFn = useMetamask((values: IRaffleRound, web3Context: Web3ContextType) => {
    const contract = new Contract(address, RaffleRandomStartRoundABI, web3Context.provider?.getSigner());

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

  // round already started
  if (parameters.roundId) {
    return null;
  }

  return (
    <Fragment>
      <ListAction
        onClick={handleStartRound}
        icon={PlayCircleOutline}
        message="pages.raffle.rounds.start"
        className={className}
        dataTestId="RaffleRoundStartButton"
        disabled={disabled || shouldDisableByContractType(contract) || !hasPermission}
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

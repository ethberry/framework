import { FC } from "react";
import { Paper, Table, TableBody, TableCell, TableContainer, TableRow } from "@mui/material";
import { FormattedMessage, useIntl } from "react-intl";

import { ConfirmationDialog } from "@gemunion/mui-dialog-confirmation";
import type { IRaffleRound } from "@framework/types";

export interface IRaffleRoundViewDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  initialValues: IRaffleRound;
}

export const RaffleRoundViewDialog: FC<IRaffleRoundViewDialogProps> = props => {
  const { initialValues, onConfirm, ...rest } = props;
  const { roundId, contract, number } = initialValues;

  const { formatMessage } = useIntl();

  const handleConfirm = (): void => {
    onConfirm();
  };

  return (
    <ConfirmationDialog message="dialogs.view" onConfirm={handleConfirm} {...rest}>
      <TableContainer component={Paper}>
        <Table aria-label="raffle ticket table">
          <TableBody>
            <TableRow>
              <TableCell component="th" scope="row">
                <FormattedMessage id="form.labels.contract" />
              </TableCell>
              <TableCell align="right">{contract?.title}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
                <FormattedMessage id="form.labels.roundId" />
              </TableCell>
              <TableCell align="right">{roundId}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
                <FormattedMessage id="form.labels.numbers" />
              </TableCell>
              <TableCell align="right">{number || formatMessage({ id: "pages.lottery.rounds.wait" })}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </ConfirmationDialog>
  );
};

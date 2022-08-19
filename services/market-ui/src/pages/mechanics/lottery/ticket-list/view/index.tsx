import { FC } from "react";
import { Paper, Table, TableBody, TableCell, TableContainer, TableRow } from "@mui/material";
import { FormattedMessage } from "react-intl";

import { ConfirmationDialog } from "@gemunion/mui-dialog-confirmation";
import { ILotteryTicket } from "@framework/types";
import { getNumbers } from "../utils";

export interface ILotteryTicketViewDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  initialValues: ILotteryTicket;
}

export const LotteryTicketViewDialog: FC<ILotteryTicketViewDialogProps> = props => {
  const { initialValues, onConfirm, ...rest } = props;
  const { roundId } = initialValues;

  const handleConfirm = (): void => {
    onConfirm();
  };

  return (
    <ConfirmationDialog message="dialogs.view" onConfirm={handleConfirm} {...rest}>
      <TableContainer component={Paper}>
        <Table aria-label="lottery ticket table">
          <TableBody>
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
              <TableCell align="right">{getNumbers(initialValues)}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </ConfirmationDialog>
  );
};

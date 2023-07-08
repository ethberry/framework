import { FC } from "react";
import { Paper, Table, TableBody, TableCell, TableContainer, TableRow } from "@mui/material";
import { FormattedMessage, useIntl } from "react-intl";

import { ConfirmationDialog } from "@gemunion/mui-dialog-confirmation";
import type { ILotteryRound } from "@framework/types";

import { getNumbers } from "../../utils";

export interface ILotteryRoundViewDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  initialValues: ILotteryRound;
}

export const LotteryRoundViewDialog: FC<ILotteryRoundViewDialogProps> = props => {
  const { initialValues, onConfirm, ...rest } = props;
  const { roundId, contract } = initialValues;

  const { formatMessage } = useIntl();

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
              <TableCell align="right">
                {initialValues.numbers
                  ? getNumbers(initialValues.numbers)
                  : formatMessage({ id: "pages.lottery.rounds.wait" })}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </ConfirmationDialog>
  );
};

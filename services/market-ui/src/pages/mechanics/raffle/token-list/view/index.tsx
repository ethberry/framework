import { FC } from "react";
import { Paper, Table, TableBody, TableCell, TableContainer, TableRow } from "@mui/material";
import { FormattedMessage } from "react-intl";

import { ConfirmationDialog } from "@gemunion/mui-dialog-confirmation";
import { AddressLink } from "@gemunion/mui-scanner";

import { IRaffleToken } from "@framework/types";

export interface IRaffleTokenViewDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  initialValues: IRaffleToken;
}

export const RaffleTokenViewDialog: FC<IRaffleTokenViewDialogProps> = props => {
  const { initialValues, onConfirm, ...rest } = props;
  const { tokenId, round, balance, tokenStatus, metadata } = initialValues;

  const handleConfirm = (): void => {
    onConfirm();
  };

  return (
    <ConfirmationDialog message="dialogs.view" onConfirm={handleConfirm} {...rest}>
      <TableContainer component={Paper}>
        <Table aria-label="raffle token table">
          <TableBody>
            <TableRow>
              <TableCell component="th" scope="row">
                <FormattedMessage id="form.labels.tokenId" />
              </TableCell>
              <TableCell align="right">{tokenId}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
                <FormattedMessage id="form.labels.raffle" />
              </TableCell>
              <TableCell align="right">{round.contract?.title}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
                <FormattedMessage id="form.labels.roundId" />
              </TableCell>
              <TableCell align="right">{round.roundId}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
                <FormattedMessage id="form.labels.winNumbers" />
              </TableCell>
              <TableCell align="right">{round ? round.number || "round not yet finished" : ""}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
                <FormattedMessage id="form.labels.tokenStatus" />
              </TableCell>
              <TableCell align="right">{metadata.PRIZE ? `PRIZE 1 of ${metadata.PRIZE}` : tokenStatus}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
                <FormattedMessage id="form.labels.account" />
              </TableCell>
              <TableCell align="right">
                <AddressLink address={balance?.at(0)?.account} length={42} />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </ConfirmationDialog>
  );
};

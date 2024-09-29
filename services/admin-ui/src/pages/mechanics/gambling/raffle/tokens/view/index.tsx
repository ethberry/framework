import { FC } from "react";
import { Paper, Table, TableBody, TableCell, TableContainer, TableRow } from "@mui/material";
import { FormattedMessage } from "react-intl";

import { ConfirmationDialog } from "@ethberry/mui-dialog-confirmation";
import { AddressLink } from "@ethberry/mui-scanner";
import type { IRaffleToken } from "@framework/types";

export interface IRaffleTokenViewDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  initialValues: IRaffleToken;
}

export const RaffleTokenViewDialog: FC<IRaffleTokenViewDialogProps> = props => {
  const { initialValues, onConfirm, ...rest } = props;
  const { tokenId, round, balance, tokenStatus } = initialValues;

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
                <FormattedMessage id="form.labels.roundId" />
              </TableCell>
              <TableCell align="right">{round.roundId}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
                <FormattedMessage id="form.labels.winNumber" />
              </TableCell>
              <TableCell align="right">{round?.number ? round.number : "round not yet finished"}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
                <FormattedMessage id="form.labels.tokenStatus" />
              </TableCell>
              <TableCell align="right">{tokenStatus}</TableCell>
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

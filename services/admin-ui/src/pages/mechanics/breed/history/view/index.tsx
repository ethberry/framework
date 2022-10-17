import { FC } from "react";
import { Paper, Table, TableBody, TableCell, TableContainer, TableRow } from "@mui/material";
import { FormattedMessage } from "react-intl";

import { ConfirmationDialog } from "@gemunion/mui-dialog-confirmation";
import type { IBreedHistory } from "@framework/types";

export interface IBreedHistoryViewDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  initialValues: IBreedHistory;
}

export const BreedHistoryViewDialog: FC<IBreedHistoryViewDialogProps> = props => {
  const { initialValues, onConfirm, ...rest } = props;
  const { account, child, matron, sire } = initialValues;

  const handleConfirm = (): void => {
    onConfirm();
  };

  return (
    <ConfirmationDialog message="dialogs.view" onConfirm={handleConfirm} {...rest}>
      <TableContainer component={Paper}>
        <Table aria-label="breed history table">
          <TableBody>
            <TableRow>
              <TableCell component="th" scope="row">
                <FormattedMessage id="form.labels.child" />
              </TableCell>
              <TableCell align="right">{child ? child.tokenId : "not yet born"}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
                <FormattedMessage id="form.labels.matron" />
              </TableCell>
              <TableCell align="right">{matron?.tokenId}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
                <FormattedMessage id="form.labels.sire" />
              </TableCell>
              <TableCell align="right">{sire?.tokenId}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
                <FormattedMessage id="form.labels.account" />
              </TableCell>
              <TableCell align="right">{account}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </ConfirmationDialog>
  );
};

import { FC } from "react";
import { Paper, Table, TableBody, TableCell, TableContainer, TableRow } from "@mui/material";
import { FormattedMessage } from "react-intl";

import { ConfirmationDialog } from "@ethberry/mui-dialog-confirmation";

import type { IComposition } from "@framework/types";

export interface IErc998CompositionViewDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  initialValues: IComposition;
}

export const Erc998CompositionViewDialog: FC<IErc998CompositionViewDialogProps> = props => {
  const { initialValues, onConfirm, ...rest } = props;

  const { parent, child, amount } = initialValues;

  const handleConfirm = (): void => {
    onConfirm();
  };

  return (
    <ConfirmationDialog message="dialogs.view" onConfirm={handleConfirm} {...rest}>
      <TableContainer component={Paper}>
        <Table aria-label="table">
          <TableBody>
            <TableRow>
              <TableCell component="th" scope="row">
                <FormattedMessage id="form.labels.parent" />
              </TableCell>
              <TableCell align="right">{parent?.title}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
                <FormattedMessage id="form.labels.child" />
              </TableCell>
              <TableCell align="right">{child?.title}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
                <FormattedMessage id="form.labels.amount" />
              </TableCell>
              <TableCell align="right">{amount}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </ConfirmationDialog>
  );
};

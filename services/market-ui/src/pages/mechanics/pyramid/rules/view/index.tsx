import { FC } from "react";
import { Paper, Table, TableBody, TableCell, TableContainer, TableRow } from "@mui/material";
import { FormattedMessage } from "react-intl";

import { ConfirmationDialog } from "@gemunion/mui-dialog-confirmation";
import { IPyramidRule } from "@framework/types";
import { RichTextDisplay } from "@gemunion/mui-rte";
import { formatPrice } from "../../../../../utils/money";

export interface IPyramidViewDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  initialValues: IPyramidRule;
}

export const PyramidViewDialog: FC<IPyramidViewDialogProps> = props => {
  const { initialValues, onConfirm, ...rest } = props;

  const { title, description, deposit, reward, duration } = initialValues;

  const handleConfirm = (): void => {
    onConfirm();
  };

  // TODO i18n

  return (
    <ConfirmationDialog message="dialogs.view" onConfirm={handleConfirm} {...rest}>
      <TableContainer component={Paper}>
        <Table aria-label="pyramid rules table">
          <TableBody>
            <TableRow>
              <TableCell component="th" scope="row">
                <FormattedMessage id="form.labels.title" />
              </TableCell>
              <TableCell align="right">{title}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
                <FormattedMessage id="form.labels.description" />
              </TableCell>
              <TableCell align="right">
                <RichTextDisplay data={description} />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
                <FormattedMessage id="form.labels.deposit" />
              </TableCell>
              <TableCell align="right">{formatPrice(deposit)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
                <FormattedMessage id="form.labels.reward" />
              </TableCell>
              <TableCell align="right">{formatPrice(reward)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
                <FormattedMessage id="form.labels.duration" />
              </TableCell>
              <TableCell align="right">{duration} days</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </ConfirmationDialog>
  );
};

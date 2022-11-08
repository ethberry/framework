import { FC } from "react";
import { Paper, Table, TableBody, TableCell, TableContainer, TableRow } from "@mui/material";
import { FormattedMessage, useIntl } from "react-intl";

import { IPyramidRule } from "@framework/types";
import { ConfirmationDialog } from "@gemunion/mui-dialog-confirmation";
import { RichTextDisplay } from "@gemunion/mui-rte";

import { formatPrice } from "../../../../../utils/money";
import { formatDuration } from "../../../../../utils/time";

export interface IPyramidViewDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  initialValues: IPyramidRule;
}

export const PyramidViewDialog: FC<IPyramidViewDialogProps> = props => {
  const { initialValues, onConfirm, ...rest } = props;
  const { title, description, deposit, reward, durationAmount, durationUnit } = initialValues;

  const { formatMessage } = useIntl();

  const handleConfirm = (): void => {
    onConfirm();
  };

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
                <FormattedMessage id="form.labels.durationAmount" />
              </TableCell>
              <TableCell align="right">
                {formatMessage(
                  { id: `enum.durationUnit.${durationUnit}` },
                  { count: formatDuration({ durationAmount, durationUnit }) },
                )}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </ConfirmationDialog>
  );
};

import { FC } from "react";
import { Paper, Table, TableBody, TableCell, TableContainer, TableRow } from "@mui/material";
import { FormattedMessage, useIntl } from "react-intl";

import { IPonziRule } from "@framework/types";
import { ConfirmationDialog } from "@gemunion/mui-dialog-confirmation";
import { RichTextDisplay } from "@gemunion/mui-rte";

import { formatPenalty, formatPrice } from "../../../../../utils/money";
import { normalizeDuration } from "../../../../../utils/time";

export interface IPonziViewDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  initialValues: IPonziRule;
}

export const PonziViewDialog: FC<IPonziViewDialogProps> = props => {
  const { initialValues, onConfirm, ...rest } = props;
  const { title, description, deposit, reward, durationAmount, durationUnit, penalty } = initialValues;

  const { formatMessage } = useIntl();

  const handleConfirm = (): void => {
    onConfirm();
  };

  return (
    <ConfirmationDialog message="dialogs.view" onConfirm={handleConfirm} {...rest}>
      <TableContainer component={Paper}>
        <Table aria-label="ponzi rules table">
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
                  { id: `enums.durationUnit.${durationUnit}` },
                  { count: normalizeDuration({ durationAmount, durationUnit }) },
                )}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
                <FormattedMessage id="form.labels.penalty" />
              </TableCell>
              <TableCell align="right">{formatPenalty(penalty)}%</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </ConfirmationDialog>
  );
};

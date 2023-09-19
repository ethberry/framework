import { FC } from "react";
import { Paper, Table, TableBody, TableCell, TableContainer, TableRow } from "@mui/material";
import { FormattedMessage, useIntl } from "react-intl";

import { RichTextDisplay } from "@gemunion/mui-rte";
import { ConfirmationDialog } from "@gemunion/mui-dialog-confirmation";
import { IPonziDeposit } from "@framework/types";

import { formatPenalty, formatPrice } from "../../../../../utils/money";
import { normalizeDuration } from "../../../../../utils/time";

export interface IStakesViewDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  initialValues: IPonziDeposit;
}

export const StakesViewDialog: FC<IStakesViewDialogProps> = props => {
  const { initialValues, onConfirm, ...rest } = props;
  const { ponziRule } = initialValues;
  const { penalty } = ponziRule || { penalty: 0 };

  const { formatMessage } = useIntl();

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
                <FormattedMessage id="form.labels.title" />
              </TableCell>
              <TableCell align="right">{ponziRule?.title}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
                <FormattedMessage id="form.labels.description" />
              </TableCell>
              <TableCell align="right">
                <RichTextDisplay data={ponziRule?.description} />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
                <FormattedMessage id="form.labels.deposit" />
              </TableCell>
              <TableCell align="right">{formatPrice(ponziRule?.deposit)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
                <FormattedMessage id="form.labels.reward" />
              </TableCell>
              <TableCell align="right">{formatPrice(ponziRule?.reward)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
                <FormattedMessage id="form.labels.durationAmount" />
              </TableCell>
              <TableCell align="right">
                {ponziRule?.durationAmount && ponziRule?.durationUnit
                  ? formatMessage(
                      { id: `enums.durationUnit.${ponziRule.durationUnit}` },
                      {
                        count: normalizeDuration({
                          durationAmount: ponziRule.durationAmount,
                          durationUnit: ponziRule.durationUnit,
                        }),
                      },
                    )
                  : null}
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

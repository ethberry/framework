import { FC } from "react";
import { Paper, Table, TableBody, TableCell, TableContainer, TableRow } from "@mui/material";
import { FormattedMessage, useIntl } from "react-intl";
import { format } from "date-fns";

import { humanReadableDateTimeFormat } from "@gemunion/constants";
import { RichTextDisplay } from "@gemunion/mui-rte";
import { ConfirmationDialog } from "@gemunion/mui-dialog-confirmation";
import { IStakingDeposit } from "@framework/types";

import { formatPenalty, formatComplexPrice } from "../../../../../utils/money";
import { formatDuration } from "../../../../../utils/time";

export interface IStakesViewDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  initialValues: IStakingDeposit;
}

export const StakesViewDialog: FC<IStakesViewDialogProps> = props => {
  const { initialValues, onConfirm, ...rest } = props;
  const { stakingRule, startTimestamp, withdrawTimestamp } = initialValues;
  const { penalty } = stakingRule || { penalty: 0 };

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
              <TableCell align="right">{stakingRule?.title}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
                <FormattedMessage id="form.labels.description" />
              </TableCell>
              <TableCell align="right">
                <RichTextDisplay data={stakingRule?.description} />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
                <FormattedMessage id="form.labels.deposit" />
              </TableCell>
              <TableCell align="right">{formatComplexPrice(stakingRule?.deposit)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
                <FormattedMessage id="form.labels.reward" />
              </TableCell>
              <TableCell align="right">{formatComplexPrice(stakingRule?.reward)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
                <FormattedMessage id="form.labels.durationAmount" />
              </TableCell>
              <TableCell align="right">
                {stakingRule?.durationAmount && stakingRule?.durationUnit
                  ? formatMessage(
                      { id: `enums.durationUnit.${stakingRule.durationUnit}` },
                      {
                        count: formatDuration({
                          durationAmount: stakingRule.durationAmount,
                          durationUnit: stakingRule.durationUnit,
                        }),
                      },
                    )
                  : null}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
                <FormattedMessage id="form.labels.startTimestamp" />
              </TableCell>
              <TableCell align="right">
                {startTimestamp ? format(new Date(startTimestamp), humanReadableDateTimeFormat) : null}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
                <FormattedMessage id="form.labels.endTimestamp" />
              </TableCell>
              <TableCell align="right">
                {withdrawTimestamp ? format(new Date(withdrawTimestamp), humanReadableDateTimeFormat) : null}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
                <FormattedMessage id="form.labels.penalty" />
              </TableCell>
              <TableCell align="right">{formatPenalty(stakingRule?.penalty)}%</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
                <FormattedMessage id="form.labels.recurrent" />
              </TableCell>
              <TableCell align="right">{stakingRule?.recurrent ? "yes" : "no"}</TableCell>
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

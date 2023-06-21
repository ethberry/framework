import { FC } from "react";
import { Paper, Table, TableBody, TableCell, TableContainer, TableRow } from "@mui/material";
import { FormattedMessage } from "react-intl";
import { addMonths, format, formatDistance, formatDuration, intervalToDuration, parseISO } from "date-fns";

import { humanReadableDateTimeFormat } from "@gemunion/constants";
import { ConfirmationDialog } from "@gemunion/mui-dialog-confirmation";
import { AddressLink } from "@gemunion/mui-scanner";
import type { IContract, IVestingParams } from "@framework/types";

export interface IVestingViewDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  initialValues: IContract;
}

export const VestingViewDialog: FC<IVestingViewDialogProps> = props => {
  const { initialValues, onConfirm, ...rest } = props;

  const { address, parameters } = initialValues;
  const { account, startTimestamp, cliffInMonth, monthlyRelease } = parameters as unknown as IVestingParams;
  const dateStart = new Date(startTimestamp);
  const dateFinish = addMonths(dateStart, Math.ceil(10000 / monthlyRelease));

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
                <FormattedMessage id="form.labels.address" />
              </TableCell>
              <TableCell align="right">
                <AddressLink address={address} />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
                <FormattedMessage id="form.labels.account" />
              </TableCell>
              <TableCell align="right">
                <AddressLink address={account} />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
                <FormattedMessage id="form.labels.startTimestamp" />
              </TableCell>
              <TableCell align="right">{format(parseISO(startTimestamp), humanReadableDateTimeFormat)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
                <FormattedMessage id="form.labels.cliffInMonth" />
              </TableCell>
              <TableCell align="right">{cliffInMonth}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
                <FormattedMessage id="form.labels.duration" />
              </TableCell>
              <TableCell align="right">
                {formatDuration(
                  intervalToDuration({
                    start: dateStart,
                    end: dateFinish,
                  }),
                  {
                    format: ["years", "months", "weeks", "days"],
                  },
                )}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
                <FormattedMessage id="form.labels.endTimestamp" />
              </TableCell>
              <TableCell align="right">{formatDistance(dateFinish, Date.now(), { addSuffix: true })}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </ConfirmationDialog>
  );
};

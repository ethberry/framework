import { FC } from "react";
import { Paper, Table, TableBody, TableCell, TableContainer, TableRow } from "@mui/material";
import { FormattedMessage } from "react-intl";
import { addMonths, format, formatDistance, formatDuration, intervalToDuration, parseISO } from "date-fns";

import { humanReadableDateTimeFormat } from "@ethberry/constants";
import { ConfirmationDialog } from "@ethberry/mui-dialog-confirmation";
import { AddressLink } from "@ethberry/mui-scanner";
import type { IContract, ILegacyVestingParams } from "@framework/types";

export interface ILegacyVestingViewDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  initialValues: IContract;
}

export const LegacyVestingViewDialog: FC<ILegacyVestingViewDialogProps> = props => {
  const { initialValues, onConfirm, ...rest } = props;

  const { address, parameters } = initialValues;
  const { account, startTimestamp, cliffInMonth, monthlyRelease } = parameters as unknown as ILegacyVestingParams;
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
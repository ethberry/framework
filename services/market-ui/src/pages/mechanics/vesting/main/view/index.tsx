import { FC } from "react";
import { Link, Paper, Table, TableBody, TableCell, TableContainer, TableRow } from "@mui/material";
import { FormattedMessage } from "react-intl";
import { format, formatDistance, formatDuration, intervalToDuration, parseISO } from "date-fns";

import { humanReadableDateTimeFormat } from "@gemunion/constants";
import { ConfirmationDialog } from "@gemunion/mui-dialog-confirmation";
import { networks } from "@gemunion/provider-wallet";
import type { IVesting } from "@framework/types";

export interface IVestingViewDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  initialValues: IVesting;
}

export const VestingViewDialog: FC<IVestingViewDialogProps> = props => {
  const { initialValues, onConfirm, ...rest } = props;

  const { account, address, duration, contractTemplate, startTimestamp } = initialValues;

  const dateStart = new Date(startTimestamp);
  const dateFinish = new Date(new Date(dateStart.getTime() + +duration));

  const handleConfirm = (): void => {
    onConfirm();
  };

  return (
    <ConfirmationDialog message="dialogs.view" onConfirm={handleConfirm} {...rest}>
      <TableContainer component={Paper}>
        <Table aria-label="vesting table">
          <TableBody>
            <TableRow>
              <TableCell component="th" scope="row">
                <FormattedMessage id="form.labels.address" />
              </TableCell>
              <TableCell align="right">
                <Link href={`${networks[~~process.env.CHAIN_ID].blockExplorerUrls[0]}/address/${address}`}>
                  {address}
                </Link>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
                <FormattedMessage id="form.labels.account" />
              </TableCell>
              <TableCell align="right">
                <Link href={`${networks[~~process.env.CHAIN_ID].blockExplorerUrls[0]}/address/${account}`}>
                  {account}
                </Link>
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
            <TableRow>
              <TableCell component="th" scope="row">
                <FormattedMessage id="form.labels.contractTemplate" />
              </TableCell>
              <TableCell align="right">{contractTemplate}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </ConfirmationDialog>
  );
};

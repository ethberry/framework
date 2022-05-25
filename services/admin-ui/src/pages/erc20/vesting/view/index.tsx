import { FC } from "react";
import { Paper, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from "@mui/material";
import { FormattedMessage } from "react-intl";
import { format, formatDistance, parseISO } from "date-fns";

import { humanReadableDateTimeFormat } from "@gemunion/constants";
import { ConfirmationDialog } from "@gemunion/mui-dialog-confirmation";
import { IErc20Vesting } from "@framework/types";

export interface IErc20VestingViewDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  initialValues: IErc20Vesting;
}

export const Erc20VestingViewDialog: FC<IErc20VestingViewDialogProps> = props => {
  const { initialValues, onConfirm, ...rest } = props;

  const { id, beneficiary, address, duration, contractTemplate, startTimestamp } = initialValues;

  const dateStart = new Date(startTimestamp);
  const dateFinish = new Date(new Date(dateStart.getTime() + +duration));

  const handleConfirm = (): void => {
    onConfirm();
  };

  return (
    <ConfirmationDialog message="dialogs.view" onConfirm={handleConfirm} {...rest}>
      <Typography variant="h5">Vesting #{id}</Typography>
      <TableContainer component={Paper}>
        <Table aria-label="vesting table">
          <TableBody>
            <TableRow>
              <TableCell component="th" scope="row">
                <FormattedMessage id="pages.erc20-vesting.view.address" />
              </TableCell>
              {/* link to scanner */}
              <TableCell align="right">{address}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
                <FormattedMessage id="pages.erc20-vesting.view.beneficiary" />
              </TableCell>
              {/* link to scanner */}
              <TableCell align="right">{beneficiary}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
                <FormattedMessage id="pages.erc20-vesting.view.startTimestamp" />
              </TableCell>
              <TableCell align="right">{format(parseISO(startTimestamp), humanReadableDateTimeFormat)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
                <FormattedMessage id="pages.erc20-vesting.view.duration" />
              </TableCell>
              <TableCell align="right">{formatDistance(new Date(+duration), 0, { addSuffix: true })}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
                <FormattedMessage id="pages.erc20-vesting.view.finish" />
              </TableCell>
              <TableCell align="right">{formatDistance(dateFinish, Date.now(), { addSuffix: true })}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
                <FormattedMessage id="pages.erc20-vesting.view.contractTemplate" />
              </TableCell>
              <TableCell align="right">{contractTemplate}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </ConfirmationDialog>
  );
};

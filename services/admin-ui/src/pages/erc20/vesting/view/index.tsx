import { FC } from "react";
import { Paper, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from "@mui/material";
import { FormattedMessage } from "react-intl";
import { formatDistance } from "date-fns";

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

  const { id, beneficiary, address, duration, vestingTemplate } = initialValues;

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
                <FormattedMessage id="pages.erc20-vesting.view.beneficiary" />
              </TableCell>
              <TableCell align="right">{beneficiary}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
                <FormattedMessage id="pages.erc20-vesting.view.address" />
              </TableCell>
              <TableCell align="right">{address}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
                <FormattedMessage id="pages.erc20-vesting.view.duration" />
              </TableCell>
              <TableCell align="right">{formatDistance(0, duration)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
                <FormattedMessage id="pages.erc20-vesting.view.template" />
              </TableCell>
              <TableCell align="right">{vestingTemplate}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </ConfirmationDialog>
  );
};

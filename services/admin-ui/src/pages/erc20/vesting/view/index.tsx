import { FC } from "react";
import { Paper, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from "@mui/material";
import { FormattedMessage } from "react-intl";
import { formatDistance } from "date-fns";

import { ConfirmationDialog } from "@gemunion/mui-dialog-confirmation";
import { IErc20Vesting } from "@framework/types";

import { formatMoney } from "../../../../utils/money";

export interface IErc20VestingViewDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  initialValues: IErc20Vesting;
}

export const Erc20VestingViewDialog: FC<IErc20VestingViewDialogProps> = props => {
  const { initialValues, onConfirm, ...rest } = props;

  const { id, beneficiary, erc20Token, amount, duration } = initialValues;

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
                <FormattedMessage id="pages.erc20-vesting.view.token" />
              </TableCell>
              <TableCell align="right">{erc20Token?.title}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
                <FormattedMessage id="pages.erc20-vesting.view.amount" />
              </TableCell>
              <TableCell align="right">{formatMoney(amount, erc20Token?.symbol)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
                <FormattedMessage id="pages.erc20-vesting.view.duration" />
              </TableCell>
              <TableCell align="right">{formatDistance(0, duration)}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </ConfirmationDialog>
  );
};

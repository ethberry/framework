import { FC } from "react";
import { Paper, Table, TableBody, TableCell, TableContainer, TableRow } from "@mui/material";
import { FormattedMessage } from "react-intl";
import { format, parseISO } from "date-fns";

import { humanReadableDateTimeFormat } from "@gemunion/constants";
import { ConfirmationDialog } from "@gemunion/mui-dialog-confirmation";
import { IReferralReward } from "@framework/types";

import { formatEther } from "../../../../../utils/money";

export interface IReferralRewardViewDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  initialValues: IReferralReward;
}

export const ReferralRewardViewDialog: FC<IReferralRewardViewDialogProps> = props => {
  const { initialValues, onConfirm, ...rest } = props;
  const { referrer, amount, level, createdAt } = initialValues;

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
                <FormattedMessage id="form.labels.referrer" />
              </TableCell>
              <TableCell align="right">{referrer}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
                <FormattedMessage id="form.labels.amount" />
              </TableCell>
              <TableCell align="right">{formatEther(amount)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
                <FormattedMessage id="form.labels.level" />
              </TableCell>
              <TableCell align="right">{level}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
                <FormattedMessage id="form.labels.createdAt" />
              </TableCell>
              <TableCell align="right">{format(parseISO(createdAt), humanReadableDateTimeFormat)}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </ConfirmationDialog>
  );
};

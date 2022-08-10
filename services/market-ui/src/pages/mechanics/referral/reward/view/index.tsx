import { FC } from "react";
import { Paper, Table, TableBody, TableCell, TableContainer, TableRow } from "@mui/material";
import { FormattedMessage } from "react-intl";

import { RichTextDisplay } from "@gemunion/mui-rte";
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
  const { referrer, amount, level } = initialValues;

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
              <TableCell align="right">
                <RichTextDisplay data={formatEther(amount)} />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
                <FormattedMessage id="form.labels.level" />
              </TableCell>
              <TableCell align="right">{level}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </ConfirmationDialog>
  );
};

import { FC } from "react";
import { Paper, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from "@mui/material";
import { FormattedMessage } from "react-intl";
import { format, formatDistance, parseISO } from "date-fns";

import { humanReadableDateTimeFormat } from "@gemunion/constants";
import { ConfirmationDialog } from "@gemunion/mui-dialog-confirmation";
import { IStake } from "@framework/types";

export interface IStakesViewDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  initialValues: IStake;
}

export const StakesViewDialog: FC<IStakesViewDialogProps> = props => {
  const { initialValues, onConfirm, ...rest } = props;
  // owner: string;
  // stakeId: string;
  // stakeStatus: StakeStatus;
  // startTimestamp: string;
  // withdrawTimestamp: string;
  // multiplier: number;
  // stakingRuleId: number;
  const { id, owner, stakeId, stakeStatus, startTimestamp, withdrawTimestamp, multiplier, stakingRule } = initialValues;

  const dateStart = new Date(startTimestamp);
  const dateFinish = new Date(new Date(dateStart.getTime() + +stakingRule.duration));

  const handleConfirm = (): void => {
    onConfirm();
  };

  return (
    <ConfirmationDialog message="dialogs.view" onConfirm={handleConfirm} {...rest}>
      {/* TODO i18n */}
      <Typography variant="h5">Vesting #{id}</Typography>
      <TableContainer component={Paper}>
        <Table aria-label="vesting table">
          <TableBody>
            <TableRow>
              <TableCell component="th" scope="row">
                <FormattedMessage id="pages.erc20-vesting.view.address" />
              </TableCell>
              {/* link to scanner */}
              <TableCell align="right">{owner}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
                <FormattedMessage id="pages.erc20-vesting.view.beneficiary" />
              </TableCell>
              {/* link to scanner */}
              <TableCell align="right">{owner}</TableCell>
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
              <TableCell align="right">{formatDistance(new Date(+stakingRule.duration), 0, { addSuffix: true })}</TableCell>
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
              <TableCell align="right">{stakeStatus}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </ConfirmationDialog>
  );
};

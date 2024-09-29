import { FC } from "react";
import { Paper, Table, TableBody, TableCell, TableContainer, TableRow } from "@mui/material";
import { FormattedMessage, useIntl } from "react-intl";

import { formatItem, formatPenalty } from "@framework/exchange";
import type { IStakingDeposit, IStakingRule } from "@framework/types";
import { ConfirmationDialog } from "@ethberry/mui-dialog-confirmation";
import { RichTextDisplay } from "@ethberry/mui-rte";
import { AddressLink } from "@ethberry/mui-scanner";

import { normalizeDuration } from "../../../../../../utils/time";
import { StakingDepositStatus } from "@framework/types";

export interface IStakingRuleExt extends IStakingRule {
  stakes: Array<IStakingDeposit>;
}

export interface IStakingViewDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  initialValues: IStakingRuleExt;
}

export const StakingViewDialog: FC<IStakingViewDialogProps> = props => {
  const { initialValues, onConfirm, ...rest } = props;
  const {
    title,
    description,
    deposit,
    reward,
    durationAmount,
    durationUnit,
    penalty,
    recurrent,
    contract,
    stakes = [],
  } = initialValues;

  // STATS
  const totalStakesCount = stakes.length;
  const activeStakesCount = stakes.filter(stake => stake.stakingDepositStatus === StakingDepositStatus.ACTIVE).length;
  let totalComp = deposit ? deposit.components : [];
  if (deposit) {
    totalComp = deposit.components.map(item => {
      return { ...item, amount: (BigInt(item.amount) * BigInt(activeStakesCount)).toString() };
    });
  }

  const { formatMessage } = useIntl();

  const handleConfirm = (): void => {
    onConfirm();
  };

  return (
    <ConfirmationDialog message="dialogs.view" onConfirm={handleConfirm} {...rest}>
      <TableContainer component={Paper}>
        <Table aria-label="staking rules table">
          <TableBody>
            <TableRow>
              <TableCell component="th" scope="row">
                <FormattedMessage id="form.labels.title" />
              </TableCell>
              <TableCell align="right">{title}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
                <FormattedMessage id="form.labels.description" />
              </TableCell>
              <TableCell align="right">
                <RichTextDisplay data={description} />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
                <FormattedMessage id="form.labels.contract" />
              </TableCell>
              <TableCell align="right">{contract!.title}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
                <FormattedMessage id="form.labels.address" />
              </TableCell>
              <TableCell align="right">
                <AddressLink address={contract?.address} />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
                <FormattedMessage id="form.labels.deposit" />
              </TableCell>
              <TableCell align="right">{formatItem(deposit)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
                <FormattedMessage id="form.labels.reward" />
              </TableCell>
              <TableCell align="right">{formatItem(reward)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
                <FormattedMessage id="form.labels.durationAmount" />
              </TableCell>
              <TableCell align="right">
                {formatMessage(
                  { id: `enums.durationUnit.${durationUnit}` },
                  { count: normalizeDuration({ durationAmount, durationUnit }) },
                )}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
                <FormattedMessage id="form.labels.penalty" />
              </TableCell>
              <TableCell align="right">{formatPenalty(penalty)}%</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
                <FormattedMessage id="form.labels.recurrent" />
              </TableCell>
              <TableCell align="right">{recurrent ? "yes" : "no"}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      {totalStakesCount > 0 ? (
        <TableContainer component={Paper}>
          <Table aria-label="staking rule history">
            <TableBody>
              <TableRow>
                <TableCell align="center" scope="row">
                  <FormattedMessage id="form.labels.stakeStat" />
                </TableCell>
              </TableRow>
              {totalStakesCount > 0 ? (
                <TableRow>
                  <TableCell component="th" scope="row">
                    <FormattedMessage id="form.labels.stakesTotal" />
                  </TableCell>
                  <TableCell align="right">{totalStakesCount}</TableCell>
                </TableRow>
              ) : null}
              {activeStakesCount > 0 ? (
                <TableRow>
                  <TableCell component="th" scope="row">
                    <FormattedMessage id="form.labels.stakesCount" />
                  </TableCell>
                  <TableCell align="right">{activeStakesCount}</TableCell>
                </TableRow>
              ) : null}
              {activeStakesCount > 0 ? (
                <TableRow>
                  <TableCell component="th" scope="row">
                    <FormattedMessage id="form.labels.tvl" />
                  </TableCell>
                  <TableCell align="right">{formatItem({ components: totalComp })}</TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          </Table>
        </TableContainer>
      ) : null}
    </ConfirmationDialog>
  );
};

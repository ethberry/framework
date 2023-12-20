import { FC } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { Typography } from "@mui/material";
import { addSeconds, formatDistance } from "date-fns";

import { formatItem, formatPenalty } from "@framework/exchange";
import { DurationUnit, IAsset } from "@framework/types";
import { FormDialog } from "@gemunion/mui-dialog-form";
import { SwitchInput } from "@gemunion/mui-inputs-core";

import { normalizeDuration } from "../../../utils/time";
import { validationSchema } from "./validation";

export interface IDepositRule {
  deposit?: IAsset;
  reward?: IAsset;
  durationAmount: number;
  durationUnit: DurationUnit;
  penalty: number;
  recurrent?: boolean;
}

export interface IDepositRewardDto {
  rule: IDepositRule;
  startTimeStamp: string;
  withdrawDeposit: boolean;
  breakLastPeriod?: boolean;
}

export interface IRewardDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: IDepositRewardDto, form?: any) => Promise<void>;
  initialValues: IDepositRewardDto;
}

export const DepositRewardDialog: FC<IRewardDialogProps> = props => {
  const { initialValues, ...rest } = props;
  const { rule, startTimeStamp } = initialValues;

  const { formatMessage } = useIntl();

  return (
    <FormDialog
      initialValues={initialValues}
      validationSchema={validationSchema}
      message="dialogs.get-reward"
      testId="DepositRewardDialogForm"
      {...rest}
    >
      <Typography variant="h6" color="textSecondary" component="div">
        <FormattedMessage
          id="dialogs.reward-item"
          values={{
            item: formatItem(rule.reward),
            period: `${formatMessage(
              { id: `enums.durationUnit.${rule.durationUnit}` },
              {
                count: normalizeDuration({
                  durationAmount: rule.durationAmount,
                  durationUnit: rule.durationUnit,
                }),
              },
            )}`,
          }}
        />
      </Typography>
      <Typography variant="body1" color="textSecondary" component="div">
        <FormattedMessage
          id="dialogs.penalty"
          values={{
            item: formatPenalty(rule.penalty),
            description: "",
          }}
        />
      </Typography>
      <Typography variant="body1" color="textSecondary" component="div">
        <FormattedMessage
          id="dialogs.staking-duration"
          values={{
            duration: formatDistance(addSeconds(new Date(startTimeStamp), rule.durationAmount || 0), Date.now(), {
              addSuffix: true,
            }),
          }}
        />
      </Typography>
      <SwitchInput name="withdrawDeposit" />
      <br />
      {rule.recurrent ? <SwitchInput name="breakLastPeriod" /> : null}
    </FormDialog>
  );
};

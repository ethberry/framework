import { FC } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { Typography } from "@mui/material";
import { FormDialog } from "@gemunion/mui-dialog-form";
import { SwitchInput } from "@gemunion/mui-inputs-core";

import { DurationUnit, IAsset } from "@framework/types";
import { validationSchema } from "./validation";
import { formatComplexPrice, formatPenalty } from "../../../utils/money";
import { normalizeDuration } from "../../../utils/time";

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
  const { rule } = initialValues;

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
            item: formatComplexPrice(rule.reward),
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
      <SwitchInput name="withdrawDeposit" />
      <br />
      {rule.recurrent ? <SwitchInput name="breakLastPeriod" /> : null}
    </FormDialog>
  );
};

import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { TextInput } from "@gemunion/mui-inputs-core";
import { StakingRuleInput } from "./rule-input";

export interface IStakeCounterDto {
  contractId?: number;
  wallet?: string;
  ruleId?: string;
}

export interface IStakesInfoDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: IStakeCounterDto, form: any) => Promise<void>;
  initialValues: IStakeCounterDto;
}

export const StakesInfoDialog: FC<IStakesInfoDialogProps> = props => {
  const { initialValues, ...rest } = props;
  const { contractId } = initialValues;

  return (
    <FormDialog
      initialValues={initialValues}
      // validationSchema={validationSchema}
      message="dialogs.stakingInfo"
      testId="StakesInfoDialogForm"
      {...rest}
    >
      <StakingRuleInput contractId={contractId} />
      <TextInput name="wallet" />
    </FormDialog>
  );
};

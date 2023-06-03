import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { NumberInput, SelectInput } from "@gemunion/mui-inputs-core";
import { IContract, IStakingContractDeployDto, StakingContractTemplates } from "@framework/types";

import { validationSchema } from "./validation";

export interface IStakingDeployDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<IContract>, form: any) => Promise<void>;
}

export const StakingDeployDialog: FC<IStakingDeployDialogProps> = props => {
  const fixedValues: IStakingContractDeployDto = {
    contractTemplate: StakingContractTemplates.SIMPLE,
  };

  return (
    <FormDialog
      initialValues={fixedValues}
      validationSchema={validationSchema}
      message="dialogs.deploy"
      testId="StakingDeployForm"
      {...props}
    >
      <SelectInput name="contractTemplate" options={StakingContractTemplates} />
    </FormDialog>
  );
};

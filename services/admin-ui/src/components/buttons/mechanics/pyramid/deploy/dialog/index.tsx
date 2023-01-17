import { FC } from "react";
// import { useFormContext } from "react-hook-form";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { SelectInput, TextInput } from "@gemunion/mui-inputs-core";

import { IContract, IPyramidContractDeployDto, PyramidContractFeatures } from "@framework/types";

import { validationSchema } from "./validation";

export interface IPyramidContractDeployDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<IContract>, form?: any) => Promise<void>;
  initialValues: IPyramidContractDeployDto;
}

export const PyramidContractDeployDialog: FC<IPyramidContractDeployDialogProps> = props => {
  const { initialValues, ...rest } = props;

  // const form = useFormContext<any>();
  //
  // const handleChange = (_event: ChangeEvent<unknown>, option: any | null): void => {
  //   form.setValue("payees", [option?.payees] ?? [0]);
  //   form.setValue("shares", [option?.shares] ?? ["0x"]);
  // };

  return (
    <FormDialog
      initialValues={initialValues}
      validationSchema={validationSchema}
      message="dialogs.deploy"
      testId="PyramidContractDeployForm"
      {...rest}
    >
      <SelectInput name="contractFeatures" options={PyramidContractFeatures} multiple />
      <TextInput name="payees" />
      <TextInput name="shares" />
    </FormDialog>
  );
};

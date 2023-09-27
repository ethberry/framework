import { ChangeEvent, FC } from "react";

import { ContractFeatures } from "@framework/types";
import { FormDialog } from "@gemunion/mui-dialog-form";
import { TextInput } from "@gemunion/mui-inputs-core";

import { CommonContractInput } from "../../../../../inputs/common-contract";
import { validationSchema } from "./validation";

export interface IChainLinkVrfSubscriptionDto {
  subscriptionId: number;
  address: string;
}

export interface IChainLinkSubscriptionDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: IChainLinkVrfSubscriptionDto, form: any) => Promise<void>;
  initialValues: IChainLinkVrfSubscriptionDto;
}

export const ChainLinkSubscriptionDialog: FC<IChainLinkSubscriptionDialogProps> = props => {
  const { initialValues, ...rest } = props;

  const handleContractChange =
    (form: any) =>
    (_event: ChangeEvent<unknown>, option: any): void => {
      form.setValue("contractId", option?.id ?? 0);
      form.setValue("address", option?.address ?? "0x");
    };

  return (
    <FormDialog
      disabled={false}
      initialValues={initialValues}
      validationSchema={validationSchema}
      message="dialogs.vrfConsumer"
      testId="VrfConsumerForm"
      {...rest}
    >
      <CommonContractInput
        name="contractId"
        data={{ contractFeatures: [ContractFeatures.RANDOM, ContractFeatures.GENES] }}
        onChange={handleContractChange}
        autoselect
      />
      <TextInput name="subscriptionId" />
    </FormDialog>
  );
};

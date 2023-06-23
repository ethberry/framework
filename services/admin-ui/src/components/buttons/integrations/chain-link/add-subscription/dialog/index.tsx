import { ChangeEvent, FC } from "react";

import { ContractFeatures } from "@framework/types";
import { FormDialog } from "@gemunion/mui-dialog-form";
import { TextInput } from "@gemunion/mui-inputs-core";

import { CommonContractInput } from "../../../../../inputs/common-contract";
import { validationSchema } from "./validation";

export interface IChainLinkVrfSubscriptionDDto {
  subscriptionId: string;
  address: string;
}

export interface IChainLinkSubscriptionDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: IChainLinkVrfSubscriptionDDto, form: any) => Promise<void>;
  initialValues: IChainLinkVrfSubscriptionDDto;
}

export const ChainLinkSubscriptionDialog: FC<IChainLinkSubscriptionDialogProps> = props => {
  const { initialValues, ...rest } = props;

  const handleContractChange =
    (form: any) =>
    (_event: ChangeEvent<unknown>, option: any | null): void => {
      form.setValue("contractId", option?.id ?? 0);
      form.setValue("address", option?.address ?? "0x");
    };

  return (
    <FormDialog
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

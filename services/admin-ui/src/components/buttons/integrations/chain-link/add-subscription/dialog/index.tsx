import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { TextInput } from "@gemunion/mui-inputs-core";

import { validationSchema } from "./validation";
import { VrfConsumerInput } from "./contract-input";

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

  return (
    <FormDialog
      initialValues={initialValues}
      validationSchema={validationSchema}
      message="dialogs.vrfConsumer"
      testId="VrfConsumerForm"
      {...rest}
    >
      <VrfConsumerInput />
      <TextInput name="subscriptionId" />
    </FormDialog>
  );
};

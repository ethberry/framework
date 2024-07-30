import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { TextInput } from "@gemunion/mui-inputs-core";

import { validationSchema } from "./validation";

export interface IChainLinkVrfSubscriptionDto {
  vrfSubId: number;
}

export interface IChainLinkSubscriptionDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: IChainLinkVrfSubscriptionDto, form: any) => Promise<void>;
  initialValues: IChainLinkVrfSubscriptionDto;
}

export const ChainLinkSetSubscriptionDialog: FC<IChainLinkSubscriptionDialogProps> = props => {
  const { initialValues, ...rest } = props;

  return (
    <FormDialog
      disabled={false}
      initialValues={initialValues}
      validationSchema={validationSchema}
      message="dialogs.vrfSetSub"
      testId="ChainLinkSetSubscriptionDialog"
      {...rest}
    >
      <TextInput name="vrfSubId" />
    </FormDialog>
  );
};

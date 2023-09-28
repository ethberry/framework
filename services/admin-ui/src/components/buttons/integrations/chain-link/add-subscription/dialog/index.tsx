import { FC } from "react";
import { FormDialog } from "@gemunion/mui-dialog-form";
import { validationSchema } from "./validation";
import { VrfSubInput } from "../../set-subscription/dialog/sub-input";
import { VrfConsumerInput } from "./contract-input";

export interface IChainLinkVrfSubscriptionDto {
  vrfSubId: number;
  address: string;
  contractId?: number;
}

export interface IChainLinkSubscriptionDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: IChainLinkVrfSubscriptionDto, form: any) => Promise<void>;
  initialValues: IChainLinkVrfSubscriptionDto;
}

export const ChainLinkSubscriptionDialog: FC<IChainLinkSubscriptionDialogProps> = props => {
  const { initialValues, ...rest } = props;

  return (
    <FormDialog
      disabled={false}
      initialValues={initialValues}
      validationSchema={validationSchema}
      message="dialogs.vrfConsumer"
      testId="VrfConsumerForm"
      {...rest}
    >
      <VrfConsumerInput />
      <VrfSubInput />
    </FormDialog>
  );
};

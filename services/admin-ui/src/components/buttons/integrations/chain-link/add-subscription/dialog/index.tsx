import { FC } from "react";

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
        controller="contracts"
        data={{ contractFeatures: [ContractFeatures.RANDOM, ContractFeatures.GENES] }}
        onChangeOptions={[
          { name: "contractId", optionName: "id", defaultValue: 0 },
          { name: "address", optionName: "address", defaultValue: "0x" },
        ]}
        autoselect
      />
      <TextInput name="subscriptionId" />
    </FormDialog>
  );
};

import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { NumberInput, SelectInput, TextInput } from "@gemunion/mui-inputs-core";
import { RichTextEditor } from "@gemunion/mui-inputs-draft";
import { emptyStateString } from "@gemunion/draft-js-utils";
import { Erc20TokenTemplate, IErc20Token, IErc20TokenCreateDto } from "@framework/types";

import { validationSchema } from "./validation";
import { AddressInput } from "./address-input";

export interface IErc20TokenDeployDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<IErc20Token>, form: any) => Promise<void>;
}

export const Erc20TokenCreateDialog: FC<IErc20TokenDeployDialogProps> = props => {
  const fixedValues: IErc20TokenCreateDto = {
    contractTemplate: Erc20TokenTemplate.EXTERNAL,
    symbol: "",
    decimals: 18,
    title: "",
    description: emptyStateString,
    address: "",
  };

  return (
    <FormDialog
      initialValues={fixedValues}
      validationSchema={validationSchema}
      message="dialogs.create"
      data-testid="Erc20TokenCreateDialog"
      {...props}
    >
      <SelectInput
        name="contractTemplate"
        options={Erc20TokenTemplate}
        disabledOptions={[Erc20TokenTemplate.SIMPLE, Erc20TokenTemplate.BLACKLIST]}
      />
      <TextInput name="symbol" />
      <NumberInput name="decimals" />
      <TextInput name="title" />
      <RichTextEditor name="description" />
      <AddressInput />
    </FormDialog>
  );
};

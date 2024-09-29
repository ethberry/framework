import { FC } from "react";
import { Web3ContextType } from "@web3-react/core";

import { useAllowance, useMetamask } from "@ethberry/react-hooks-eth";
import { FormDialog } from "@ethberry/mui-dialog-form";
import { EntityInput } from "@ethberry/mui-inputs-entity";
import { TextInput } from "@ethberry/mui-inputs-core";
import { DateTimeInput } from "@ethberry/mui-inputs-picker";
import { TokenAssetInput } from "@ethberry/mui-inputs-asset";
import type { IClaim } from "@framework/types";
import { ModuleType, TokenType } from "@framework/types";
import { convertDatabaseAssetToTokenTypeAsset } from "@framework/exchange";

import { validationSchema } from "./validation";

export interface IClaimEditDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<IClaim>, form: any) => Promise<void>;
  initialValues: IClaim;
}

export const ClaimTokenEditDialog: FC<IClaimEditDialogProps> = props => {
  const { initialValues, onConfirm, ...rest } = props;

  const { id, item, account, endTimestamp, merchantId } = initialValues;
  const fixedValues = {
    id,
    item,
    account,
    endTimestamp,
    merchantId,
  };

  const message = id ? "dialogs.edit" : "dialogs.create";

  const metaFnWithAllowance = useAllowance((_web3Context: Web3ContextType, values: IClaim, form: any) => {
    return onConfirm(values, form).then(() => null);
  });

  const metaFn = useMetamask((values: IClaim, form: any, web3Context: Web3ContextType) => {
    const assets = convertDatabaseAssetToTokenTypeAsset(values.item.components);
    return metaFnWithAllowance(
      {
        contract: values.account,
        assets,
      },
      web3Context,
      values,
      form,
    );
  });

  const handleConfirm = async (values: IClaim, form: any) => {
    return metaFn(values, form);
  };

  return (
    <FormDialog
      initialValues={fixedValues}
      validationSchema={validationSchema}
      message={message}
      testId="ClaimTokenEditDialog"
      onConfirm={handleConfirm}
      {...rest}
    >
      <EntityInput name="merchantId" controller="merchants" disableClear />
      <TextInput name="account" required />
      <TokenAssetInput
        required
        multiple
        prefix="item"
        contract={{ data: { contractModule: [ModuleType.HIERARCHY, ModuleType.MYSTERY] } }}
        tokenType={{ disabledOptions: [TokenType.NATIVE] }}
      />
      <DateTimeInput name="endTimestamp" format={"dd/LL/yyyy hh:mm a"} />
    </FormDialog>
  );
};

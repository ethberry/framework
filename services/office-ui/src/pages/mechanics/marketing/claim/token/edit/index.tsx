import { FC } from "react";
import { Web3ContextType } from "@web3-react/core";

import { useMetamask } from "@gemunion/react-hooks-eth";
import { FormDialog } from "@gemunion/mui-dialog-form";
import { EntityInput } from "@gemunion/mui-inputs-entity";
import { TextInput } from "@gemunion/mui-inputs-core";
import { DateTimeInput } from "@gemunion/mui-inputs-picker";
import { TokenAssetInput } from "@gemunion/mui-inputs-asset";
import type { IAssetComponent, IClaim } from "@framework/types";
import { ModuleType, TokenType } from "@framework/types";
import { convertDatabaseAssetToTokenTypeAsset } from "@framework/exchange";

import { useAllowance } from "../../../../../../utils/use-allowance";
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
    const assets = convertDatabaseAssetToTokenTypeAsset(values.item.components as unknown as Array<IAssetComponent>);
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

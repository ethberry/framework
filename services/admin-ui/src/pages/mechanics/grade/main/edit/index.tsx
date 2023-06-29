import { ChangeEvent, FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { SelectInput, TextInput } from "@gemunion/mui-inputs-core";
import { TemplateAssetInput } from "@gemunion/mui-inputs-asset";
import { ContractFeatures, ContractStatus, GradeStatus, GradeStrategy, IGrade, TokenType } from "@framework/types";

import { CommonContractInput } from "../../../../../components/inputs/common-contract";
import { validationSchema } from "./validation";
import { GrowthRateInput } from "./growth-rate-input";

export interface IGradeEditDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<IGrade>, form: any) => Promise<void>;
  initialValues: IGrade;
}

export const GradeEditDialog: FC<IGradeEditDialogProps> = props => {
  const { initialValues, ...rest } = props;

  const { id, contractId, attribute, gradeStatus, gradeStrategy, growthRate, price } = initialValues;
  const fixedValues = {
    id,
    contractId,
    attribute,
    gradeStatus,
    gradeStrategy,
    growthRate,
    price,
  };

  const message = id ? "dialogs.edit" : "dialogs.create";

  const handleContractChange =
    (form: any) =>
    (_event: ChangeEvent<unknown>, option: any | null): void => {
      form.setValue("contractId", option?.id ?? 0);
    };

  return (
    <FormDialog
      initialValues={fixedValues}
      validationSchema={validationSchema}
      message={message}
      testId="GradeEditForm"
      {...rest}
    >
      <CommonContractInput
        name="contractId"
        readOnly={!!id}
        onChange={handleContractChange}
        autoselect
        data={{
          contractStatus: [ContractStatus.ACTIVE],
          contractFeatures: [ContractFeatures.UPGRADEABLE],
        }}
      />
      <TextInput name="attribute" readOnly={!!id} />
      {id ? <SelectInput name="gradeStatus" options={GradeStatus} /> : null}
      <SelectInput name="gradeStrategy" options={GradeStrategy} />
      <GrowthRateInput />
      <TemplateAssetInput
        autoSelect
        prefix="price"
        tokenType={{ disabledOptions: [TokenType.ERC721, TokenType.ERC998] }}
      />
    </FormDialog>
  );
};

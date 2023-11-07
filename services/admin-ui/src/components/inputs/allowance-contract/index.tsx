import { ChangeEvent, FC } from "react";
import { useFormContext, useWatch } from "react-hook-form";

import { ComboEntityInput } from "@gemunion/mui-inputs-entity";
import { ContractFeatures, ContractStatus, ModuleType, TokenType } from "@framework/types";

export interface IAllowanceContractInputProps {
  name: string;
  controller?: string;
  autoselect?: boolean;
  readOnly?: boolean;
  disableClear?: boolean;
  withTokenType?: boolean;
  data?: {
    contractType?: Array<TokenType>;
    contractStatus?: Array<ContractStatus>;
    contractModule?: Array<ModuleType>;
    contractFeatures?: Array<ContractFeatures>;
    [k: string]: any;
  };
  onChange?: (form: any) => (_event: ChangeEvent<unknown>, option: any) => void;
}

export const AllowanceContractInput: FC<IAllowanceContractInputProps> = props => {
  const {
    autoselect,
    readOnly,
    disableClear,
    name,
    onChange,
    controller = "contracts",
    data = {},
    withTokenType = false,
  } = props;

  const form = useFormContext<any>();
  const tokenType = useWatch({ name: "tokenType" });

  return (
    <ComboEntityInput
      name={name}
      controller={controller}
      data={{ ...data, ...(withTokenType ? { contractType: [tokenType] } : {}) }}
      onChange={onChange ? onChange(form) : undefined}
      autoselect={autoselect}
      readOnly={readOnly}
      disableClear={disableClear}
    />
  );
};

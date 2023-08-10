import { ChangeEvent, FC } from "react";
import { useFormContext, useWatch } from "react-hook-form";

import { EntityInput } from "@gemunion/mui-inputs-entity";
import { ContractFeatures, ContractStatus, ModuleType, TokenType } from "@framework/types";

export interface ICommonContractInputProps {
  name: string;
  controller?: string;
  multiple?: boolean;
  autoselect?: boolean;
  withTokenType?: boolean;
  readOnly?: boolean;
  data?: {
    contractType?: Array<TokenType>;
    contractStatus?: Array<ContractStatus>;
    contractModule?: Array<ModuleType>;
    contractFeatures?: Array<ContractFeatures>;
  };
  onChange?: (form: any) => (_event: ChangeEvent<unknown>, option: any) => void;
}

export const CommonContractInput: FC<ICommonContractInputProps> = props => {
  const {
    autoselect,
    multiple,
    readOnly,
    name,
    onChange,
    controller = "contracts",
    data = {},
    withTokenType = false,
  } = props;

  const form = useFormContext<any>();
  const tokenType = useWatch({ name: "tokenType" });

  return (
    <EntityInput
      name={name}
      controller={controller}
      data={{ ...data, ...(withTokenType ? { contractType: [tokenType] } : {}) }}
      onChange={onChange ? onChange(form) : undefined}
      autoselect={autoselect}
      readOnly={readOnly}
      multiple={multiple}
    />
  );
};

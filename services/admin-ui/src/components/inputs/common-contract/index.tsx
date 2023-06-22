import { ChangeEvent, FC } from "react";
import { useFormContext, useWatch } from "react-hook-form";

import { EntityInput } from "@gemunion/mui-inputs-entity";
import { ContractFeatures, ContractStatus, ModuleType, TokenType } from "@framework/types";

export interface ICommonContractInputProps {
  name: string;
  controller?: string;
  multiple?: boolean;
  autoselect?: boolean;
  useTokenType?: boolean;
  data?: {
    contractType?: Array<TokenType>;
    contractStatus?: Array<ContractStatus>;
    contractModule?: Array<ModuleType>;
    contractFeatures?: Array<ContractFeatures>;
  };
  onChangeOptions?: Array<{ name: string; optionName: string; defaultValue: string | number }>;
}

export const CommonContractInput: FC<ICommonContractInputProps> = props => {
  const {
    autoselect,
    multiple,
    name,
    onChangeOptions = [],
    controller = "contracts",
    data = {},
    useTokenType = false,
  } = props;

  const form = useFormContext<any>();
  const tokenType = useWatch({ name: "tokenType" });

  const handleChange = (_event: ChangeEvent<unknown>, option: any | null): void => {
    onChangeOptions?.forEach(({ name, optionName, defaultValue }) => {
      form.setValue(name, option?.[optionName] ?? defaultValue);
    });
  };

  return (
    <EntityInput
      name={name}
      controller={controller}
      data={{ ...data, ...(useTokenType ? { contractType: [tokenType] } : {}) }}
      onChange={onChangeOptions.length ? handleChange : undefined}
      autoselect={autoselect}
      multiple={multiple}
    />
  );
};

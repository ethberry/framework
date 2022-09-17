import { ChangeEvent, FC, useEffect } from "react";
import { useFormContext, useWatch } from "react-hook-form";

import { EntityInput } from "@gemunion/mui-inputs-entity";
import { ContractStatus, ModuleType } from "@framework/types";
import { emptyItem, emptyPrice } from "../empty-price";

export interface IContractInputProps {
  prefix: string;
  name?: string;
  readOnly?: boolean;
  contractModule?: Array<ModuleType>;
}

export const ContractInput: FC<IContractInputProps> = props => {
  const { prefix, name = "contractId", contractModule = [], readOnly } = props;

  const tokenType = useWatch({ name: `${prefix}.tokenType` });
  const form = useFormContext<any>();

  const handleChange = (_event: ChangeEvent<unknown>, option: any | null): void => {
    form.setValue(`${prefix}.${name}`, option?.id ?? 0);
    form.setValue(`${prefix}.address`, option?.address ?? "0x");
    form.setValue(`${prefix}.decimals`, option?.decimals ?? 0);
  };

  useEffect(() => {
    form.setValue(
      `${prefix}.${name}`,
      (prefix.split(".")[0] === "price" ? emptyPrice : emptyItem).components[0].contractId,
    );
  }, [tokenType]);

  return (
    <EntityInput
      name={`${prefix}.${name}`}
      controller="contracts"
      data={{
        contractStatus: [ContractStatus.ACTIVE],
        contractType: [tokenType],
        contractModule,
      }}
      onChange={handleChange}
      readOnly={readOnly}
    />
  );
};

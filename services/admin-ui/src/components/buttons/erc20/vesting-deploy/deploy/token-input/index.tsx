import { ChangeEvent, FC } from "react";
import { useFormikContext } from "formik";

import { EntityInput, IAutocompleteOption } from "@gemunion/mui-inputs-entity";

export interface IErc20TokenInputProps {
  name?: string;
}

export const Erc20TokenInput: FC<IErc20TokenInputProps> = props => {
  const { name = "erc20TokenId" } = props;

  const formik = useFormikContext<any>();

  return (
    <EntityInput
      name="erc20TokenId"
      controller="erc20-tokens"
      onChange={(
        _event: ChangeEvent<unknown>,
        options: Array<IAutocompleteOption> | IAutocompleteOption | null,
      ): void => {
        const value = options as IAutocompleteOption;
        formik.setFieldValue(name, value.id);
        formik.setFieldValue("token", value.address);
      }}
    />
  );
};

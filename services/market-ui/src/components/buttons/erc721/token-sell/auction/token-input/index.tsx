import { ChangeEvent, FC } from "react";
import { EntityInput, IAutocompleteOption } from "@gemunion/mui-inputs-entity";
import { useFormikContext } from "formik";
import { useIntl } from "react-intl";

export interface IErc20TokenInputProps {
  name?: string;
  label?: string;
}

export const Erc20TokenInput: FC<IErc20TokenInputProps> = props => {
  const { name = "token", label = "erc20TokenId" } = props;

  const formik = useFormikContext<any>();
  const { formatMessage } = useIntl();

  const handleTokenChange = (
    _event: ChangeEvent<unknown>,
    options: IAutocompleteOption | Array<IAutocompleteOption> | null,
  ): void => {
    const value = options as IAutocompleteOption;
    formik.setFieldValue(name, value);
  };

  return (
    <EntityInput
      name={name}
      label={formatMessage({ id: `form.labels.${label}` })}
      controller="erc20-tokens"
      onChange={handleTokenChange}
    />
  );
};

import { ChangeEvent, FC } from "react";
import { EntityInput, IAutocompleteOption } from "@gemunion/mui-inputs-entity";
import { useFormContext } from "react-hook-form";
import { useIntl } from "react-intl";

export interface IErc20TokenInputProps {
  name?: string;
  label?: string;
}

export const Erc20TokenInput: FC<IErc20TokenInputProps> = props => {
  const { name = "token", label = "erc20TokenId" } = props;

  const form = useFormContext<any>();
  const { formatMessage } = useIntl();

  const handleTokenChange = (
    _event: ChangeEvent<unknown>,
    options: IAutocompleteOption | Array<IAutocompleteOption> | null,
  ): void => {
    const value = options as IAutocompleteOption;
    form.setValue(name, value);
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

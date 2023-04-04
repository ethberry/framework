import { FC } from "react";
import { useWatch } from "react-hook-form";
import { useIntl } from "react-intl";

import { TokenType } from "@framework/types";
import { SelectInput } from "@gemunion/mui-inputs-core";

interface ISearchTokenSelectInputProps {
  prefix: string;
}

export const SearchTokenSelectInput: FC<ISearchTokenSelectInputProps> = props => {
  const { prefix } = props;
  const { formatMessage } = useIntl();
  const emptyReward = useWatch({ name: "emptyReward" });

  return (
    <SelectInput
      name={`${prefix}.tokenType`}
      options={TokenType}
      label={formatMessage({ id: `form.labels.${prefix}` })}
      disabled={prefix === "reward" && emptyReward}
    />
  );
};

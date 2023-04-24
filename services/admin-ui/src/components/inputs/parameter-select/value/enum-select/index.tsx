import { FC, useEffect, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";

import { useApiCall } from "@gemunion/react-hooks";

import { SelectInput } from "../../select";

export interface IEnumSelectInputProps {
  name: string;
  prefix: string;
}

export const EnumSelectInput: FC<IEnumSelectInputProps> = props => {
  const { name, prefix } = props;

  const form = useFormContext();
  const parameterName = useWatch({ name: `${prefix}.parameterName` });

  const [options, setOptions] = useState<string[]>([]);

  const { fn: getParameterEnum } = useApiCall(
    (api, data) =>
      api
        .fetchJson({
          url: "/parameter/enum",
          data,
        })
        .then(json => {
          setOptions(json);
        }),
    { success: false },
  );

  useEffect(() => {
    void getParameterEnum(form, parameterName);
  }, [parameterName]);

  return <SelectInput name={name} options={options} prefix={prefix} />;
};

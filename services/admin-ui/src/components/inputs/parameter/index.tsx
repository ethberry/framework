import { FC, useEffect, useMemo, useState } from "react";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";
import { Box, IconButton, Paper, Tooltip, Typography } from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import { FormattedMessage, useIntl } from "react-intl";

import type { IParameter } from "@framework/types";
import { ProductParameters } from "@framework/types";
import { SelectInput } from "@gemunion/mui-inputs-core";

import { getEmptyParameter } from "./empty";
import { ParameterMaxValueInput } from "./maxValue";
import { ParameterTypeInput } from "./type";
import { getLeftParameterNames } from "./utils";
import { ParameterValueInput } from "./value";

type IParameterParams = IParameter & {
  id: string;
};

export interface IParameterInput {
  prefix?: string;
  multiple?: boolean;
  readOnly?: boolean;
}

export const ParameterInput: FC<IParameterInput> = props => {
  const { multiple = true, prefix = "parameters", readOnly = false } = props;

  const { formatMessage } = useIntl();
  const form = useFormContext<any>();
  const ancestorPrefix = prefix.split(".").pop() as string;
  const { fields, append, remove } = useFieldArray({ name: prefix, control: form.control });
  const watchFields = useWatch({ name: prefix });
  const parameters: IParameterParams[] = fields.map(
    (field, index) =>
      ({
        ...field,
        ...watchFields[index],
      } as IParameterParams),
  );

  const leftParameterNames = getLeftParameterNames({ parameters });
  const disabledOptions = Object.values(ProductParameters).filter(g =>
    leftParameterNames?.length ? !leftParameterNames.includes(g) : true,
  );

  const [isAddable, setIsAddable] = useState<boolean>(!!leftParameterNames);

  const handleOptionAdd = (): (() => void) => (): void => {
    const emptyParameter = getEmptyParameter({ parameters });

    if (emptyParameter) {
      append(emptyParameter);
    }
  };

  const handleOptionDelete =
    (i: number): (() => void) =>
    (): void => {
      remove(i);
    };

  useEffect(() => {
    if (!parameters.length) {
      setIsAddable(true);
    } else {
      setIsAddable(!!leftParameterNames);
    }
  }, [parameters]);

  return useMemo(
    () => (
      <Box mt={2}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography sx={{ mr: 1 }}>
            <FormattedMessage id={`form.labels.${ancestorPrefix}`} />
          </Typography>
          {multiple && isAddable ? (
            <Tooltip title={formatMessage({ id: "form.tips.create" })}>
              <IconButton size="small" aria-label="add" onClick={handleOptionAdd()}>
                <Add fontSize="large" color="primary" />
              </IconButton>
            </Tooltip>
          ) : null}
        </Box>

        {parameters?.map((p: IParameterParams, i: number) => (
          <Box key={p.id} mt={1} mb={1} display="flex" justifyContent="space-between" alignItems="center">
            <Box flex={1}>
              <Paper sx={{ p: 2, display: "flex", alignItems: "stretch", flex: 1, flexDirection: "column" }}>
                <SelectInput
                  name={`${prefix}[${i}].parameterName`}
                  options={ProductParameters}
                  disabledOptions={disabledOptions}
                />
                <ParameterTypeInput prefix={`${prefix}[${i}]`} />
                <ParameterValueInput prefix={`${prefix}[${i}]`} />
                <ParameterMaxValueInput prefix={`${prefix}[${i}]`} />
              </Paper>
            </Box>

            {multiple && (
              <Box ml={2}>
                <Tooltip title={formatMessage({ id: "form.tips.delete" })}>
                  <span>
                    <IconButton aria-label="delete" onClick={handleOptionDelete(i)}>
                      <Delete />
                    </IconButton>
                  </span>
                </Tooltip>
              </Box>
            )}
          </Box>
        ))}
      </Box>
    ),
    [isAddable, multiple, readOnly, fields, watchFields],
  );
};

import { FC, useEffect, useMemo, useState } from "react";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";
import { Box, IconButton, Paper, Tooltip, Typography } from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import { FormattedMessage, useIntl } from "react-intl";

import type { IParameter } from "@framework/types";
import { useApiCall } from "@gemunion/react-hooks";

import { uniqueBy } from "../../../utils/uniqueBy";
import { getEmptyParameter } from "./empty";
import { getAvailableNames } from "./utils";
import { ParameterValueInput } from "./value";
import { SelectInput } from "./select";

export interface IParameterSelectInput {
  prefix?: string;
  multiple?: boolean;
  readOnly?: boolean;
}

export const ParameterSelectInput: FC<IParameterSelectInput> = props => {
  const { multiple = true, prefix = "parameters", readOnly = false } = props;

  const { formatMessage } = useIntl();
  const form = useFormContext<any>();
  const ancestorPrefix = prefix.split(".").pop() as string;
  const { fields, append, remove } = useFieldArray({ name: prefix, control: form.control });
  const watchFields = useWatch({ name: prefix });
  const parameters: IParameter[] = fields.map(
    (field, index) =>
      ({
        ...field,
        ...watchFields[index],
      }) as IParameter,
  );

  const [allParameters, setAllParameters] = useState<IParameter[] | null>(null);
  const [allNames, setAllNames] = useState<string[]>([]);

  const availableNames = getAvailableNames({ allNames, parameters });
  const disabledOptions = allNames.filter(p => (availableNames?.length ? !availableNames.includes(p) : true));

  const [isAddable, setIsAddable] = useState<boolean>(!!availableNames);

  const handleOptionAdd = (): (() => void) => (): void => {
    const emptyParameter = getEmptyParameter({ allNames, parameters });

    if (emptyParameter) {
      append(emptyParameter);
    }
  };

  const handleOptionDelete =
    (i: number): (() => void) =>
    (): void => {
      remove(i);
    };

  const { fn: getAllParameters } = useApiCall(
    api =>
      api
        .fetchJson({
          url: "/parameter",
        })
        .then(json => {
          setAllParameters(json.rows);
          setAllNames(uniqueBy<IParameter>(json.rows, "parameterName").map(({ parameterName }) => parameterName));
        }),
    { success: false },
  );

  useEffect(() => {
    if (!allParameters) {
      void getAllParameters();
    }
  }, [allParameters]);

  useEffect(() => {
    if (!parameters.length) {
      setIsAddable(true);
    } else {
      setIsAddable(!!availableNames);
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

        {parameters?.map((p: IParameter, i: number) => (
          <Box key={p.id} mt={1} mb={1} display="flex" justifyContent="space-between" alignItems="center">
            <Box flex={1}>
              <Paper sx={{ p: 2, display: "flex", alignItems: "stretch", flex: 1, flexDirection: "column" }}>
                <SelectInput
                  name="parameterName"
                  prefix={`${prefix}[${i}]`}
                  options={allNames}
                  disabledOptions={disabledOptions}
                />
                <ParameterValueInput prefix={`${prefix}[${i}]`} />
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
    [allParameters, isAddable, multiple, readOnly, fields, watchFields],
  );
};

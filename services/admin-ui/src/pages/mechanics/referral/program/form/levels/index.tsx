import { FC } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { Box, IconButton, Paper, Tooltip, Typography } from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";

import type { IReferralProgram } from "@framework/types";
import { NumberInput } from "@gemunion/mui-inputs-core";
import { CurrencyInput } from "@gemunion/mui-inputs-mask";

export type TReferralProgram = IReferralProgram & {
  id: string;
};

export const getEmptyProgramLevel = (levels: IReferralProgram[]): Partial<IReferralProgram> => ({
  level: levels.length + 1,
  share: 500,
});

export const ReferralProgramLevelsInput: FC = () => {
  const { formatMessage } = useIntl();
  const form = useFormContext<any>();

  const { fields, append, remove } = useFieldArray({ name: "levels", control: form.control });
  const watchFields = useWatch({ name: "levels" });
  const values: TReferralProgram[] = fields.map(
    (field, index) =>
      ({
        ...field,
        ...watchFields[index],
      }) as TReferralProgram,
  );

  const handleOptionAdd = (): (() => void) => (): void => {
    append(getEmptyProgramLevel(values));
  };

  const handleOptionDelete =
    (i: number): (() => void) =>
    (): void => {
      remove(i);
    };

  return (
    <Box mt={2}>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Typography sx={{ mr: 1 }}>
          <FormattedMessage id="pages.referral.program.levels" />
        </Typography>
        <Tooltip title={formatMessage({ id: "form.tips.create" })}>
          <IconButton size="small" aria-label="add" onClick={handleOptionAdd()}>
            <Add fontSize="large" color="primary" />
          </IconButton>
        </Tooltip>
      </Box>

      {values.map((program, i) => (
        <Box key={program.id} mt={1} mb={1} display="flex" justifyContent="space-between" alignItems="center">
          <Box flex={1}>
            <Paper sx={{ p: 2, display: "flex", alignItems: "stretch", flex: 1, flexDirection: "column" }}>
              <NumberInput name={`levels[${i}].level`} inputProps={{ min: 1 }} />
              <CurrencyInput name={`levels[${i}].share`} symbol="%" />
            </Paper>
          </Box>

          <Box ml={2}>
            <Tooltip title={formatMessage({ id: "form.tips.delete" })}>
              <span>
                <IconButton aria-label="delete" onClick={handleOptionDelete(i)} disabled={!i}>
                  <Delete />
                </IconButton>
              </span>
            </Tooltip>
          </Box>
        </Box>
      ))}
    </Box>
  );
};

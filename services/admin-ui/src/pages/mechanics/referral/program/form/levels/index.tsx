import { FC, useCallback } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { Box, IconButton, Paper, Tooltip, Typography } from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";

import type { IReferralProgram, IUser } from "@framework/types";
import { CurrencyInput } from "@gemunion/mui-inputs-mask";
import { useUser } from "@gemunion/provider-user";
import { useDeepCompareEffect } from "@gemunion/react-hooks";

export type TReferralProgram = IReferralProgram & {
  id: string;
};

// LEVEL0 = total share
// export const getEmptyProgramLevel = (levels: IReferralProgram[]): Array<Partial<IReferralProgram>> => {
export const getEmptyProgramLevel = (
  levels: IReferralProgram[],
  merchantId: number,
): Array<{ merchantId: number; level: number; share: number }> => {
  if (levels.length === 0) {
    return [
      {
        merchantId,
        level: 0,
        share: 1000,
      },
      {
        merchantId,
        level: levels.length + 1,
        share: 1000,
      },
    ];
  } else {
    return [
      {
        merchantId,
        level: levels.length + 1,
        share: 0,
      },
    ];
  }
};

export const ReferralProgramLevelsInput: FC = () => {
  const { formatMessage } = useIntl();
  const { profile } = useUser<IUser>();
  const merchantId = profile?.merchantId;
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

  const handleOptionAdd = useCallback(
    (): (() => void) => (): void => {
      append(getEmptyProgramLevel(values, merchantId));
    },
    [merchantId],
  );

  const handleOptionDelete =
    (i: number): (() => void) =>
    (): void => {
      remove(i);
    };

  useDeepCompareEffect(() => {
    void form.trigger();
  }, [values]);

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
              {i === 0 ? (
                <FormattedMessage id="pages.referral.program.total" />
              ) : (
                <FormattedMessage id="pages.referral.program.level" values={{ level: i }} />
              )}
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

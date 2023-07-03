import { FC } from "react";
import { Grid } from "@mui/material";

import { FormWrapper } from "@gemunion/mui-form";
import type { IRatePlan } from "@framework/types";
import { NumberInput, StaticInput } from "@gemunion/mui-inputs-core";
import { useApiCall } from "@gemunion/react-hooks";

import { validationSchema } from "../profile/general/validation";

export interface ITabPanelProps {
  limits: Array<IRatePlan>;
  open: boolean;
}

export const RatePlanTab: FC<ITabPanelProps> = props => {
  const { open, limits } = props;

  const { fn } = useApiCall((api, { tokenId }: { tokenId: number }) => {
    return api
      .fetchJson({
        url: `/rate-plans/${tokenId}`,
      })
      .then(console.info);
  });

  const handleSubmit = async (values: Array<{ ratePlanId: number; amount: number }>, form: any): Promise<void> => {
    await fn(form, values);
  };

  if (!open) {
    return null;
  }

  return (
    <FormWrapper
      initialValues={{ limits: limits.map(({ id, ...rest }) => ({ ratePlanId: id, id, ...rest })) }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {limits.map((limit, i) => (
        <Grid container spacing={2} key={limit.id}>
          <Grid item xs={4}>
            <StaticInput name={`limits[${i}].contractModule`} />
          </Grid>
          <Grid item xs={4}>
            <StaticInput name={`limits[${i}].contractType`} />
          </Grid>
          <Grid item xs={4}>
            <NumberInput name={`limits[${i}].amount`} />
          </Grid>
          <NumberInput name={`limits[${i}].ratePlanId`} style={{ display: "none" }} />
        </Grid>
      ))}
    </FormWrapper>
  );
};

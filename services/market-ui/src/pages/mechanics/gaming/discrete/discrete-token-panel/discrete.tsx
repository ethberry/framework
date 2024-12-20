import { FC } from "react";
import { Grid } from "@mui/material";

import { ProtectedAttribute } from "@framework/types";

import { omit } from "../../../../../utils/lodash";

export interface ITokenMetadataViewProps {
  metadata: Record<string, any>;
}

export const TokenDiscreteView: FC<ITokenMetadataViewProps> = props => {
  const { metadata } = props;

  const result = Object.entries(metadata).reduce(
    (memo, [key, value]) => Object.assign(memo, { [key]: value }),
    {} as Record<string, any>,
  );

  const filteredResult = omit(result, Object.values(ProtectedAttribute));

  return (
    <Grid container>
      {Object.entries(filteredResult)
        .slice(0, 6)
        .map(([key, value]) => (
          <Grid key={key} container>
            <Grid item xs={6}>
              {key}
            </Grid>
            <Grid item xs={6}>
              {value}
            </Grid>
          </Grid>
        ))}
    </Grid>
  );
};

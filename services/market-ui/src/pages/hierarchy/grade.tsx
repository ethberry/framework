import { FC } from "react";
import { Grid } from "@mui/material";

export interface ITokenMetadataView {
  metadata: Record<string, any>;
}

export const TokenGradeView: FC<ITokenMetadataView> = props => {
  const { metadata } = props;

  const result = Object.entries(metadata).reduce(
    (memo, [key, value]) => Object.assign(memo, { [key]: value }),
    {} as Record<string, any>,
  );

  // TODO filter common TEMPLATE_ID metadata
  const { TEMPLATE_ID: _, RARITY: __, ...filteredResult } = result;

  return (
    <Grid container>
      {Object.entries(filteredResult)
        .slice(0, 6)
        .map(([key, value], i) => (
          <Grid key={i} container>
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

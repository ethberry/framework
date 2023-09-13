import { FC } from "react";
import { Grid } from "@mui/material";

import { TokenMetadata } from "@framework/types";
import { decodeTraits, DND } from "@framework/traits-ui";

export interface ITokenGenesisView {
  metadata: Record<string, any>;
}

export const TokenGenesisView: FC<ITokenGenesisView> = props => {
  const { metadata } = props;

  const result = Object.entries(decodeTraits(BigInt(metadata[TokenMetadata.GENES]), DND)).reduce(
    (memo, [key, value]) => Object.assign(memo, { [key]: value }),
    {} as Record<string, any>,
  );

  return (
    <Grid container>
      {Object.entries(result)
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

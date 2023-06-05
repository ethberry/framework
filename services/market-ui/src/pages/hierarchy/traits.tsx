import { FC } from "react";
import { BigNumber } from "ethers";
import { Grid } from "@mui/material";

import { TokenMetadata } from "@framework/types";
import { decodeTraits, DND } from "@framework/traits";

export interface ITokenMetadataView {
  metadata: Record<string, any>;
}

export const TokenTraitsView: FC<ITokenMetadataView> = props => {
  const { metadata } = props;

  const result = Object.entries(decodeTraits(BigInt(metadata[TokenMetadata.TRAITS]), DND)).reduce(
    (memo, [key, value]) => Object.assign(memo, { [key]: value }),
    {} as Record<string, any>,
  );

  return (
    <Grid container>
      {Object.entries(result)
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

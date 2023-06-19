import { FC } from "react";
import { BigNumber } from "ethers";
import { Grid } from "@mui/material";

import { TokenMetadata } from "@framework/types";
import { decodeTraits } from "@framework/traits-ui";

export interface ITokenGenesisView {
  metadata: Record<string, any>;
}

export const TokenGenesisView: FC<ITokenGenesisView> = props => {
  const { metadata } = props;

  const DND = ["Matron", "Sire"];

  const result = Object.entries(decodeTraits(BigInt(metadata[TokenMetadata.TRAITS]), DND)).reduce(
    (memo, [key, value]) => Object.assign(memo, { [key]: value }),
    {} as Record<string, any>,
  );

  return (
    <Grid container>
      {Object.entries(result)
        .reverse()
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

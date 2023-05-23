import { FC } from "react";
import { BigNumber } from "ethers";
import { Grid } from "@mui/material";

import { TokenMetadata } from "@framework/types";
import { decodeGenes } from "@framework/genes";

export interface ITokenGenesisView {
  metadata: Record<string, any>;
}

export const TokenGenesisView: FC<ITokenGenesisView> = props => {
  const { metadata } = props;

  const DND = ["Matron", "Sire"];

  const result = Object.entries(decodeGenes(BigNumber.from(metadata[TokenMetadata.GENES]), DND)).reduce(
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

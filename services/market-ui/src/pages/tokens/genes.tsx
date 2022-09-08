import { FC } from "react";
import { BigNumber } from "ethers";
import { Grid } from "@mui/material";

import { TokenAttributes } from "@framework/types";
import { decodeGenes } from "@framework/genes";

export interface ITokenAttributesView {
  attributes: Record<string, any>;
}

export const TokenAttributesView: FC<ITokenAttributesView> = props => {
  const { attributes } = props;

  const result = Object.entries(decodeGenes(BigNumber.from(attributes[TokenAttributes.GENES]))).reduce(
    (memo, [key, value]) => Object.assign(memo, { [key]: value }),
    {} as Record<string, any>,
  );

  return (
    <Grid container>
      {Object.entries(result).map(([key, value], i) => (
        <Grid key={i} container>
          <Grid xs={6}>{key}</Grid>
          <Grid xs={6}>{value}</Grid>
        </Grid>
      ))}
    </Grid>
  );
};

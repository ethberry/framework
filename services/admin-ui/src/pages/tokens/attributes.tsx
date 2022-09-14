import { FC } from "react";
import { BigNumber } from "ethers";
import { Grid } from "@mui/material";

import { TokenAttributes, TokenRarity } from "@framework/types";
import { decodeGenes } from "@framework/genes";

export interface ITokenAttributesView {
  attributes: Record<string, any>;
}

export const TokenAttributesView: FC<ITokenAttributesView> = props => {
  const { attributes } = props;

  const result = Object.entries(attributes).reduce((memo, [key, value]) => {
    switch (key) {
      // MODULE:GRADE
      case TokenAttributes.GRADE:
        Object.assign(memo, { [key]: value });
        break;
      // MODULE:RANDOM
      case TokenAttributes.RARITY:
        Object.assign(memo, { [key]: Object.values(TokenRarity)[~~value] });
        break;
      // MODULE:BREEDING
      case TokenAttributes.GENES:
        Object.entries(decodeGenes(BigNumber.from(value))).forEach(([key, value]) => {
          Object.assign(memo, { [key]: value });
        });
        break;
      case TokenAttributes.TEMPLATE_ID:
      default:
        break;
    }

    return memo;
  }, {} as Record<string, any>);

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

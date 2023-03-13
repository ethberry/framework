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

  const DND = ["strength", "dexterity", "constitution", "intelligence", "wisdom", "charisma", "sire", "matron"];

  const result = Object.entries(decodeGenes(BigNumber.from(attributes[TokenAttributes.GENES]), DND)).reduce(
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

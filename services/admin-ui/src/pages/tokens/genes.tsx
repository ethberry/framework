import { FC } from "react";
import { BigNumber } from "ethers";
import { Grid } from "@mui/material";
import { FormattedMessage } from "react-intl";

import { TokenAttributes } from "@framework/types";
import { decodeGenes } from "@framework/genes";

export interface ITokenAttributesView {
  attributes: Record<string, any>;
}

export const TokenGenesView: FC<ITokenAttributesView> = props => {
  const { attributes } = props;
  const DND = ["matron", "sire", "strength", "dexterity", "constitution", "intelligence", "wisdom", "charisma"];

  const result = Object.entries(attributes).reduce((memo, [key, value]) => {
    switch (key) {
      // MODULE:BREEDING
      case TokenAttributes.GENES:
        Object.entries(decodeGenes(BigNumber.from(value), DND))
          .slice(2) // delete sire & matron info from genes
          .forEach(([key, value]) => {
            Object.assign(memo, { [key.toUpperCase()]: value });
          });
        break;
      default:
        break;
    }

    return memo;
  }, {} as Record<string, any>);

  return (
    <Grid container>
      {Object.entries(result).map(([key, value], i) => (
        <Grid key={i} container>
          <Grid xs={6} item>
            <FormattedMessage id={`enums.geneName.${key}`} />
          </Grid>
          <Grid xs={6} item>
            {value}
          </Grid>
        </Grid>
      ))}
    </Grid>
  );
};

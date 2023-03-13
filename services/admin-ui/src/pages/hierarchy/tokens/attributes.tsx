import { FC } from "react";
import { Grid } from "@mui/material";
import { FormattedMessage } from "react-intl";

import { TokenAttributes, TokenRarity } from "@framework/types";

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
      // case TokenAttributes.TEMPLATE_ID:
      //   Object.assign(memo, { [key]: ~~value });
      //   break;
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
            <FormattedMessage id={`enums.attributeName.${key}`} />
          </Grid>
          <Grid xs={6} item>
            {value}
          </Grid>
        </Grid>
      ))}
    </Grid>
  );
};

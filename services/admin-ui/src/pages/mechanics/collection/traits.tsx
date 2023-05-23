import { FC } from "react";
import { Grid } from "@mui/material";
import { FormattedMessage } from "react-intl";

import { TokenTraits } from "@framework/types";

export interface ITokenMetadataView {
  metadata: Record<string, any>;
}

export const TokenTraitsView: FC<ITokenMetadataView> = props => {
  const { metadata } = props;
  const result = Object.entries(metadata).reduce((memo, [key, value]) => {
    switch (key) {
      // MODULE:COLLECTION
      case TokenTraits.CLOTHES:
      case TokenTraits.EYES:
      case TokenTraits.MOUTH:
        Object.assign(memo, { [key]: value });
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
            <FormattedMessage id={`enums.traitName.${key}`} />
          </Grid>
          <Grid xs={6} item>
            {value}
          </Grid>
        </Grid>
      ))}
    </Grid>
  );
};

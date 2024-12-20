import { FC } from "react";
import { Grid } from "@mui/material";
import { FormattedMessage } from "react-intl";

import { TokenMetadata } from "@framework/types";
import { decodeTraits, DND } from "@gemunion/traits-v5";

export interface ITokenMetadataView {
  metadata: Record<string, any>;
}

export const TokenTraitsView: FC<ITokenMetadataView> = props => {
  const { metadata } = props;

  const result = Object.entries(metadata).reduce(
    (memo, [key, value]) => {
      switch (key as TokenMetadata) {
        // MODULE:DND
        // MODULE:BREEDING
        // MODULE:COLLECTION
        case TokenMetadata.TRAITS:
          Object.entries(decodeTraits(BigInt(value), DND))
            .slice(2) // delete sire & matron info from traits
            .forEach(([key, value]) => {
              Object.assign(memo, { [key.toUpperCase()]: value });
            });
          break;
        default:
          break;
      }

      return memo;
    },
    {} as Record<string, any>,
  );

  return (
    <Grid container>
      {Object.entries(result).map(([key, value]) => (
        <Grid key={key} container>
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

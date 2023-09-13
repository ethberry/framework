import { FC } from "react";
import { Grid } from "@mui/material";
import { FormattedMessage } from "react-intl";

import { TokenMetadata, TokenRarity } from "@framework/types";

export interface ITokenMetadataView {
  metadata: Record<string, any>;
}

export const getFilteredAttributes = (metadata: Record<string, any>) =>
  Object.entries(metadata).reduce(
    (memo, [key, value]) => {
      switch (key) {
        // MODULE:GRADE
        case TokenMetadata.LEVEL:
          Object.assign(memo, { [key]: value });
          break;
        // MODULE:RANDOM
        case TokenMetadata.RARITY:
          Object.assign(memo, { [key]: Object.values(TokenRarity)[~~value] });
          break;
        // case TokenAttributes.TEMPLATE_ID:
        //   Object.assign(memo, { [key]: ~~value });
        //   break;
        default:
          break;
      }

      return memo;
    },
    {} as Record<string, any>,
  );

export const shouldShowAttributes = (metadata: Record<string, any>) => {
  return Object.entries(getFilteredAttributes(metadata)).length > 0;
};

export const TokenAttributesView: FC<ITokenMetadataView> = props => {
  const { metadata } = props;

  const result = getFilteredAttributes(metadata);

  return (
    <Grid container>
      {Object.entries(result).map(([key, value]) => (
        <Grid key={key} container>
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

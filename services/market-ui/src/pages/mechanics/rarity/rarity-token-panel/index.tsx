import { FC } from "react";
import { FormattedMessage } from "react-intl";
import { Card, CardContent, Toolbar, Typography } from "@mui/material";

import type { IToken } from "@framework/types";
import { ContractFeatures, TokenMetadata, TokenRarity } from "@framework/types";

export interface IRarityTokenPanelProps {
  token: IToken;
}

export const RarityTokenPanel: FC<IRarityTokenPanelProps> = props => {
  const { token } = props;

  if (!token.template?.contract?.contractFeatures.includes(ContractFeatures.RANDOM)) {
    return null;
  }

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Toolbar disableGutters sx={{ minHeight: "1em !important" }}>
          <Typography gutterBottom variant="h5" component="p" sx={{ flexGrow: 1 }}>
            <FormattedMessage id="pages.token.rarity" />
          </Typography>
        </Toolbar>
        <Typography>{Object.values(TokenRarity)[token.metadata[TokenMetadata.RARITY]]}</Typography>
      </CardContent>
    </Card>
  );
};

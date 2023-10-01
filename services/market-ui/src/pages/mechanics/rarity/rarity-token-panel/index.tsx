import { FC } from "react";
import { FormattedMessage } from "react-intl";
import { CardContent, Typography } from "@mui/material";

import type { IToken } from "@framework/types";
import { ContractFeatures, TokenMetadata, TokenRarity } from "@framework/types";
import { StyledCard, StyledToolbar, StyledTypography } from "./styled";

export interface IRarityTokenPanelProps {
  token: IToken;
}

export const RarityTokenPanel: FC<IRarityTokenPanelProps> = props => {
  const { token } = props;

  if (!token.template?.contract?.contractFeatures.includes(ContractFeatures.RANDOM)) {
    return null;
  }

  return (
    <StyledCard>
      <CardContent>
        <StyledToolbar disableGutters>
          <StyledTypography gutterBottom variant="h5" component="p">
            <FormattedMessage id="pages.token.rarity" />
          </StyledTypography>
        </StyledToolbar>
        <Typography>{Object.values(TokenRarity)[token.metadata[TokenMetadata.RARITY]]}</Typography>
      </CardContent>
    </StyledCard>
  );
};

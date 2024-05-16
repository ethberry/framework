import { FC } from "react";
import { useIntl } from "react-intl";
import { CardContent, Typography } from "@mui/material";

import type { IToken } from "@framework/types";
import { ContractFeatures, TokenMetadata, TokenRarity } from "@framework/types";
import { StyledCard } from "./styled";
import { StyledCardHeader } from "../../../../hierarchy/shared/styledCardHeader";

export interface IRarityTokenPanelProps {
  token: IToken;
}

export const RarityTokenPanel: FC<IRarityTokenPanelProps> = props => {
  const { token } = props;
  const { formatMessage } = useIntl();

  if (!token.template?.contract?.contractFeatures.includes(ContractFeatures.RANDOM)) {
    return null;
  }

  return (
    <StyledCard>
      <StyledCardHeader title={formatMessage({ id: "pages.token.rarity" })} />
      <CardContent>
        <Typography>{Object.values(TokenRarity)[token.metadata[TokenMetadata.RARITY]] || ""}</Typography>
      </CardContent>
    </StyledCard>
  );
};

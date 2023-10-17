import { FC } from "react";
import { FormattedMessage } from "react-intl";
import { CardContent } from "@mui/material";

import type { IToken } from "@framework/types";
import { ContractFeatures } from "@framework/types";

import { TokenTraitsView } from "./traits";
import { StyledCard, StyledToolbar, StyledTypography } from "./styled";

export interface ITraitTokenPanelProps {
  token: IToken;
}

export const TraitTokenPanel: FC<ITraitTokenPanelProps> = props => {
  const { token } = props;

  if (!token.template?.contract?.contractFeatures.includes(ContractFeatures.TRAITS)) {
    return null;
  }

  return (
    <StyledCard>
      <CardContent>
        <StyledToolbar disableGutters>
          <StyledTypography gutterBottom variant="h5" component="p">
            <FormattedMessage id="pages.token.traits" />
          </StyledTypography>
        </StyledToolbar>
        <TokenTraitsView metadata={token.metadata} />
      </CardContent>
    </StyledCard>
  );
};

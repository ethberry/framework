import { FC } from "react";
import { FormattedMessage } from "react-intl";
import { CardContent } from "@mui/material";

import type { IToken } from "@framework/types";
import { ContractFeatures } from "@framework/types";

import { TokenGenesisView } from "./genesis";
import { StyledCard, StyledToolbar, StyledTypography } from "./styled";

export interface IGenesTokenPanelProps {
  token: IToken;
}

export const GenesTokenPanel: FC<IGenesTokenPanelProps> = props => {
  const { token } = props;

  if (!token.template?.contract?.contractFeatures.includes(ContractFeatures.GENES)) {
    return null;
  }

  return (
    <StyledCard>
      <CardContent>
        <StyledToolbar disableGutters>
          <StyledTypography gutterBottom variant="h5" component="p">
            <FormattedMessage id="pages.token.genesis" />
          </StyledTypography>
        </StyledToolbar>
        <TokenGenesisView metadata={token.metadata} />
      </CardContent>
    </StyledCard>
  );
};

import { FC } from "react";
import { FormattedMessage } from "react-intl";
import { CardActions, CardContent } from "@mui/material";
import { constants } from "ethers";

import type { IToken } from "@framework/types";
import { ContractFeatures } from "@framework/types";

import { TokenLendButton } from "../../../../../components/buttons";
import { StyledCard, StyledList, StyledToolbar, StyledTypography } from "./styled";

export interface ILendTokenPanelProps {
  token: IToken;
}

export const LendTokenPanel: FC<ILendTokenPanelProps> = props => {
  const { token } = props;

  if (!token.template?.contract?.contractFeatures.includes(ContractFeatures.RENTABLE)) {
    return null;
  }

  return (
    <StyledCard>
      <CardContent>
        <StyledToolbar disableGutters>
          <StyledTypography gutterBottom variant="h5" component="p">
            <FormattedMessage id="pages.token.tokenUser" />
          </StyledTypography>
        </StyledToolbar>
        <StyledList component="ul">
          {!token.metadata.user || token.metadata.user === constants.AddressZero ? "N/A" : token.metadata.user}
        </StyledList>
      </CardContent>
      <CardActions>
        <TokenLendButton token={token} />
      </CardActions>
    </StyledCard>
  );
};

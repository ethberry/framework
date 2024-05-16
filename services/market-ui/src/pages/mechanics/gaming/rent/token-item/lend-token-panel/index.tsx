import { FC } from "react";
import { useIntl } from "react-intl";
import { CardActions, CardContent } from "@mui/material";
import { constants } from "ethers";

import type { IToken } from "@framework/types";
import { ContractFeatures } from "@framework/types";

import { TokenLendButton } from "../../../../../../components/buttons";
import { StyledCard, StyledList } from "./styled";
import { StyledCardHeader } from "../../../../../hierarchy/shared/styledCardHeader";

export interface ILendTokenPanelProps {
  token: IToken;
}

export const LendTokenPanel: FC<ILendTokenPanelProps> = props => {
  const { token } = props;
  const { formatMessage } = useIntl();

  if (!token.template?.contract?.contractFeatures.includes(ContractFeatures.RENTABLE)) {
    return null;
  }

  return (
    <StyledCard>
      <StyledCardHeader title={formatMessage({ id: "pages.token.tokenUser" })} />

      <CardContent>
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

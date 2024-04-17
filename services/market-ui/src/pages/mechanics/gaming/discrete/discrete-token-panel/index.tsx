import { FC } from "react";
import { FormattedMessage } from "react-intl";
import { CardActions, CardContent } from "@mui/material";

import type { IToken } from "@framework/types";
import { ContractFeatures } from "@framework/types";

import { GradeButton } from "../../../../../components/buttons";
import { AllowanceInfoPopover } from "../../../../../components/dialogs/allowance";
import { TokenDiscreteView } from "./discrete";
import { StyledCard, StyledToolbar, StyledTypography } from "./styled";

export interface IDiscreteTokenPanelProps {
  token: IToken;
}

export const DiscreteTokenPanel: FC<IDiscreteTokenPanelProps> = props => {
  const { token } = props;

  if (!token.template?.contract?.contractFeatures.includes(ContractFeatures.DISCRETE)) {
    return null;
  }

  return (
    <StyledCard>
      <CardContent>
        <StyledToolbar disableGutters>
          <StyledTypography gutterBottom variant="h5" component="p">
            <FormattedMessage id="pages.token.discrete" />
          </StyledTypography>
          <AllowanceInfoPopover />
        </StyledToolbar>
        <TokenDiscreteView metadata={token.metadata} />
      </CardContent>
      <CardActions>
        <GradeButton token={token} />
      </CardActions>
    </StyledCard>
  );
};

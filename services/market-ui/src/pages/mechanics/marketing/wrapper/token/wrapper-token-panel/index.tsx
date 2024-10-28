import { FC } from "react";
import { FormattedMessage } from "react-intl";
import { CardActions, CardContent } from "@mui/material";

import { formatItemHtmlList } from "@framework/exchange";
import type { IToken } from "@framework/types";
import { ModuleType } from "@framework/types";

import { WrapperBoxUnpackButton } from "../../../../../../components/buttons";
import { StyledCard, StyledList, StyledToolbar, StyledTypography } from "./styled";

export interface IWrapperTokenPanelProps {
  token: IToken;
}

export const WrapperTokenPanel: FC<IWrapperTokenPanelProps> = props => {
  const { token } = props;

  if (token.template?.contract?.contractModule !== ModuleType.WRAPPER) {
    return null;
  }

  return (
    <StyledCard>
      <CardContent>
        <StyledToolbar disableGutters>
          <StyledTypography gutterBottom variant="h5" component="p">
            <FormattedMessage id="pages.token.wrapper" />
          </StyledTypography>
        </StyledToolbar>
        {/* @ts-ignore */}
        <StyledList component="ul">{formatItemHtmlList(token.template?.box?.content)}</StyledList>
      </CardContent>

      <CardActions>
        <WrapperBoxUnpackButton token={token} />
      </CardActions>
    </StyledCard>
  );
};
